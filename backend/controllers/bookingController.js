const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');

const bookingController = {
  // Create a new booking
  create: async (req, res) => {
    try {
      const {
        rental_id,
        start_date,
        end_date,
        guests,
        total_amount
      } = req.body;

      // Check if dates are available
      const bookingModel = new Booking(req.app.locals.pool);
      const isAvailable = await bookingModel.checkAvailability(
        rental_id,
        start_date,
        end_date
      );

      if (!isAvailable) {
        return res.status(400).json({
          message: 'Selected dates are not available'
        });
      }

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total_amount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          rental_id,
          start_date,
          end_date,
          guests
        }
      });

      // Create booking with payment intent ID
      const booking = await bookingModel.create({
        user_id: req.user.id,
        rental_id,
        start_date,
        end_date,
        guests,
        total_amount,
        payment_intent_id: paymentIntent.id
      });

      res.status(201).json({
        booking,
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      console.error('Error creating booking:', error);
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
  }
};

module.exports = bookingController;

