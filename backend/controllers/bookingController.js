const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
const Booking = require('../models/Booking');
const BookingService = require('../models/BookingService');
const Rental = require('../models/Rental');

const bookingController = {
  // Create a new booking
  create: async (req, res) => {
    try {
      console.log('Booking request received:', req.body);
      console.log('User ID:', req.user.id);
      
      const {
        rental_id,
        start_date,
        end_date,
        guests,
        total_amount,
        services
      } = req.body;

      // Validate required fields
      if (!rental_id || !start_date || !end_date || !total_amount) {
        console.log('Missing required fields:', { rental_id, start_date, end_date, total_amount });
        return res.status(400).json({
          message: 'Missing required fields: rental_id, start_date, end_date, total_amount'
        });
      }

      console.log('Checking availability for rental:', rental_id);
      // Check if dates are available
      const bookingModel = new Booking(req.app.locals.pool);
      const isAvailable = await bookingModel.checkAvailability(
        rental_id,
        start_date,
        end_date
      );

      console.log('Availability check result:', isAvailable);
      if (!isAvailable) {
        return res.status(400).json({
          message: 'Selected dates are not available'
        });
      }

      let paymentIntent = null;
      let clientSecret = null;

      // Create Stripe payment intent only if Stripe is properly configured
      if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_dummy') {
        try {
          console.log('Creating Stripe payment intent...');
          paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total_amount * 100), // Convert to cents
            currency: 'usd',
            metadata: {
              rental_id,
              start_date,
              end_date,
              guests
            }
          });
          clientSecret = paymentIntent.client_secret;
          console.log('Stripe payment intent created:', paymentIntent.id);
        } catch (stripeError) {
          console.error('Stripe error:', stripeError);
          // Continue without Stripe for now
        }
      } else {
        console.log('Skipping Stripe payment intent creation (not configured)');
      }

      console.log('Creating booking in database...');
      // Create booking with or without payment intent ID
      const booking = await bookingModel.create({
        user_id: req.user.id,
        rental_id,
        start_date,
        end_date,
        guests,
        total_amount,
        payment_intent_id: paymentIntent ? paymentIntent.id : null
      });

      console.log('Booking created successfully:', booking.id);

      // Create booking services if any are selected
      if (services && services.length > 0) {
        console.log('Creating booking services:', services);
        const bookingServiceModel = new BookingService(req.app.locals.pool);
        
        for (const service of services) {
          await bookingServiceModel.create({
            booking_id: booking.id,
            service_id: service.id,
            service_name: service.name,
            service_price: service.price
          });
        }
        console.log('Booking services created successfully');
      }

      res.status(201).json({
        booking,
        clientSecret: clientSecret
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        message: 'Error creating booking',
        error: error.message
      });
    }
  },

  // Get user's bookings
  getUserBookings: async (req, res) => {
    try {
      const bookingModel = new Booking(req.app.locals.pool);
      const bookings = await bookingModel.findByUserId(req.user.id);
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({
        message: 'Error fetching bookings',
        error: error.message
      });
    }
  },

  // Get bookings for properties owned by current user
  getOwnerBookings: async (req, res) => {
    try {
      const bookingModel = new Booking(req.app.locals.pool);
      const bookings = await bookingModel.findByOwnerId(req.user.id);
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching owner bookings:', error);
      res.status(500).json({
        message: 'Error fetching owner bookings',
        error: error.message
      });
    }
  },

  // Get booking by ID
  getBookingById: async (req, res) => {
    try {
      const bookingModel = new Booking(req.app.locals.pool);
      const booking = await bookingModel.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          message: 'Booking not found'
        });
      }

      // Check if user owns the booking
      if (booking.user_id !== req.user.id) {
        return res.status(403).json({
          message: 'Not authorized to view this booking'
        });
      }

      res.json(booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({
        message: 'Error fetching booking',
        error: error.message
      });
    }
  },

  // Cancel a booking
  cancel: async (req, res) => {
    try {
      const bookingModel = new Booking(req.app.locals.pool);
      const booking = await bookingModel.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          message: 'Booking not found'
        });
      }

      // Check if user owns the booking
      if (booking.user_id !== req.user.id) {
        return res.status(403).json({
          message: 'Not authorized to cancel this booking'
        });
      }

      // Cancel the booking
      const updatedBooking = await bookingModel.update(req.params.id, {
        status: 'cancelled'
      });

      // If there's a payment intent, cancel it
      if (booking.payment_intent_id) {
        await stripe.paymentIntents.cancel(booking.payment_intent_id);
      }

      res.json(updatedBooking);
    } catch (error) {
      console.error('Error canceling booking:', error);
      res.status(500).json({
        message: 'Error canceling booking',
        error: error.message
      });
    }
  },

  // Check availability
  checkAvailability: async (req, res) => {
    try {
      const { rental_id, start_date, end_date } = req.query;
      const bookingModel = new Booking(req.app.locals.pool);
      
      const isAvailable = await bookingModel.checkAvailability(
        rental_id,
        start_date,
        end_date
      );

      res.json({ available: isAvailable });
    } catch (error) {
      console.error('Error checking availability:', error);
      res.status(500).json({
        message: 'Error checking availability',
        error: error.message
      });
    }
  },

  // Webhook handler for Stripe events
  handleWebhook: async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      const bookingModel = new Booking(req.app.locals.pool);

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          const booking = await bookingModel.findById(paymentIntent.metadata.booking_id);
          
          if (booking) {
            await bookingModel.updatePaymentStatus(booking.id, 'paid', paymentIntent.id);
            await bookingModel.updateStatus(booking.id, 'confirmed');
          }
          break;

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object;
          const failedBooking = await bookingModel.findById(failedPayment.metadata.booking_id);
          
          if (failedBooking) {
            await bookingModel.updatePaymentStatus(failedBooking.id, 'failed');
          }
          break;
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({
        message: 'Error processing webhook',
        error: error.message
      });
    }
  },

  // Update booking status
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      console.log('Updating booking status:', { id, status, userId: req.user.id });

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      // Define valid status values
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
      
      // Validate status value
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: `Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}` 
        });
      }

      const bookingModel = new Booking(req.app.locals.pool);
      const booking = await bookingModel.findById(id);

      console.log('Found booking:', booking);

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Ensure only the owner of the rental can update the status
      const rentalModel = new Rental(req.app.locals.pool);
      const rental = await rentalModel.findById(booking.rental_id);
      
      console.log('Found rental:', rental);
      console.log('Authorization check:', { 
        rentalOwnerId: rental?.owner_id, 
        currentUserId: req.user.id,
        isAuthorized: rental && rental.owner_id === req.user.id 
      });

      if (!rental || rental.owner_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this booking status' });
      }

      try {
        // Update the status
        const updatedBooking = await bookingModel.updateStatus(id, status);
        console.log('Booking updated successfully:', updatedBooking);
        res.json(updatedBooking);
      } catch (updateError) {
        console.error('Error in updateStatus query:', updateError);
        console.error('Error details:', {
          error: updateError.message,
          code: updateError.code,
          detail: updateError.detail,
          hint: updateError.hint,
          where: updateError.where
        });
        throw updateError;
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        message: 'Error updating booking status', 
        error: error.message,
        details: error.detail || error.hint || error.where
      });
    }
  }
};

module.exports = bookingController;

