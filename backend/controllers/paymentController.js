const NotificationService = require('../services/notificationService');

const paymentController = {
  // Create payment intent
  createPaymentIntent: async (req, res) => {
    const client = await req.app.locals.pool.connect();
    try {
      await client.query('BEGIN');

      const { booking_id } = req.body;

      // Get booking details
      const bookingResult = await client.query(
        `SELECT b.*, r.title as property_name, r.owner_id, u.full_name as user_name
         FROM bookings b
         JOIN rentals r ON b.rental_id = r.id
         JOIN users u ON b.user_id = u.id
         WHERE b.id = $1`,
        [booking_id]
      );

      if (bookingResult.rows.length === 0) {
        throw new Error('Booking not found');
      }

      const booking = bookingResult.rows[0];

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: booking.total_amount * 100, // Convert to cents
        currency: 'usd',
        metadata: {
          booking_id: booking.id
        }
      });

      // Update booking with payment intent ID
      await client.query(
        'UPDATE bookings SET payment_intent_id = $1 WHERE id = $2',
        [paymentIntent.id, booking_id]
      );

      // Create notification service instance
      const notificationService = new NotificationService(req.app.locals.pool);

      // Send payment due notification
      await notificationService.notifyPaymentDue(booking);

      await client.query('COMMIT');

      res.json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating payment intent:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating payment intent',
        error: error.message
      });
    } finally {
      client.release();
    }
  },

  // Handle successful payment
  handleSuccessfulPayment: async (req, res) => {
    const client = await req.app.locals.pool.connect();
    try {
      await client.query('BEGIN');

      const { payment_intent_id } = req.body;

      // Get booking details
      const bookingResult = await client.query(
        `SELECT b.*, r.title as property_name, r.owner_id, u.full_name as user_name
         FROM bookings b
         JOIN rentals r ON b.rental_id = r.id
         JOIN users u ON b.user_id = u.id
         WHERE b.payment_intent_id = $1`,
        [payment_intent_id]
      );

      if (bookingResult.rows.length === 0) {
        throw new Error('Booking not found');
      }

      const booking = bookingResult.rows[0];

      // Update booking status
      await client.query(
        'UPDATE bookings SET status = $1, payment_status = $2 WHERE id = $3',
        ['confirmed', 'paid', booking.id]
      );

      // Create notification service instance
      const notificationService = new NotificationService(req.app.locals.pool);

      // Send payment received notification
      await notificationService.notifyPaymentReceived(booking);

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Payment processed successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error processing payment:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing payment',
        error: error.message
      });
    } finally {
      client.release();
    }
  }
};

module.exports = paymentController; 