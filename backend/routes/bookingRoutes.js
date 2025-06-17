const express = require('express')
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Rental = require('../models/rentalModel');
const NotificationService = require('../services/notificationService');

// Get user's bookings
router.get('/user', auth, bookingController.getUserBookings);

// Get bookings for a specific user by ID
router.get('/user/:userId', auth, async (req, res) => {
  const client = await req.app.locals.pool.connect();
  try {
    const { userId } = req.params;
    
    // Validate userId is a number
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const query = `
      SELECT b.*, 
             r.title as property_name,
             u.full_name as user_name,
             u.email as user_email
      FROM bookings b
      LEFT JOIN rentals r ON b.rental_id = r.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `;

    const result = await client.query(query, [userId]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user bookings',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Get user's concierge bookings
router.get('/concierge/user', auth, async (req, res) => {
  const client = await req.app.locals.pool.connect();
  try {
    const query = `
      SELECT sr.*, 
             cs.name as service_name, 
             cs.category,
             u.full_name as provider_name, 
             u.email as provider_email
      FROM service_requests sr
      JOIN concierge_services cs ON sr.service_id = cs.id
      JOIN users u ON cs.owner_id = u.id
      WHERE sr.user_id = $1
      ORDER BY sr.created_at DESC
    `;

    const result = await client.query(query, [req.user.id]);
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching concierge bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching concierge bookings',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Get provider's concierge bookings
router.get('/concierge/provider', auth, async (req, res) => {
  const client = await req.app.locals.pool.connect();
  try {
    const query = `
      SELECT sr.*, 
             cs.name as service_name, 
             cs.category,
             u.full_name as customer_name, 
             u.email as customer_email
      FROM service_requests sr
      JOIN concierge_services cs ON sr.service_id = cs.id
      JOIN users u ON sr.user_id = u.id
      WHERE cs.owner_id = $1
      ORDER BY sr.created_at DESC
    `;

    const result = await client.query(query, [req.user.id]);
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching provider concierge bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching provider concierge bookings',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Create a concierge booking
router.post('/concierge', auth, async (req, res) => {
  const client = await req.app.locals.pool.connect();
  try {
    await client.query('BEGIN');

    const {
      service_id,
      service_type,
      date,
      time,
      duration,
      total_amount,
      notes
    } = req.body;

    console.log('Received booking data:', req.body);
    console.log('User ID:', req.user.id);

    // Validate required fields
    if (!service_id || !date || !time || !duration || !total_amount) {
      throw new Error(`Missing required fields: ${JSON.stringify({
        service_id: !!service_id,
        date: !!date,
        time: !!time,
        duration: !!duration,
        total_amount: !!total_amount
      })}`);
    }

    // Check if service exists and get provider info
    const serviceResult = await client.query(
      'SELECT * FROM concierge_services WHERE id = $1',
      [service_id]
    );

    console.log('Service query result:', serviceResult.rows);

    if (serviceResult.rows.length === 0) {
      throw new Error('Service not found');
    }

    const service = serviceResult.rows[0];
    console.log('Service found:', service);

    // Create the booking
    const bookingQuery = `
      INSERT INTO bookings (
        user_id,
        service_id,
        service_type,
        date,
        time,
        duration,
        total_amount,
        notes,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const bookingParams = [
      req.user.id,
      service_id,
      service_type || 'concierge',
      date,
      time,
      duration,
      total_amount,
      notes || '',
      'pending'
    ];

    console.log('Executing booking query:', bookingQuery);
    console.log('With parameters:', bookingParams);

    const bookingResult = await client.query(bookingQuery, bookingParams);

    console.log('Booking created:', bookingResult.rows[0]);

    const booking = bookingResult.rows[0];

    // Create notification
    try {
      const notificationService = new NotificationService(req.app.locals.pool);
      await notificationService.createNotification({
        recipient_id: service.owner_id,
        sender_id: req.user.id,
        title: 'New Concierge Service Booking',
        message: `You have a new booking request for ${service.title}`,
        type: 'booking',
        link: `/bookings/${booking.id}`
      });
      console.log('Notification created successfully');
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Don't throw the error, just log it
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating concierge booking:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      where: error.where
    });
    res.status(500).json({
      success: false,
      message: 'Error creating concierge booking',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Get all bookings (filtered by type: 'owner' or 'renter')
router.get('/', auth, async (req, res) => {
  const client = await req.app.locals.pool.connect();
  try {
    const { type } = req.query; // 'owner' or 'renter'
    let query;
    let params = [req.user.id];

    if (type === 'owner') {
      query = `
        SELECT b.*, r.title as property_name, r.owner_id,
               u.full_name as renter_name, u.email as renter_email
        FROM bookings b
        JOIN rentals r ON b.rental_id = r.id
        JOIN users u ON b.user_id = u.id
        WHERE r.owner_id = $1
        ORDER BY b.created_at DESC
      `;
    } else {
      query = `
        SELECT b.*, r.title as property_name, r.owner_id,
               u.full_name as owner_name, u.email as owner_email
        FROM bookings b
        JOIN rentals r ON b.rental_id = r.id
        JOIN users u ON r.owner_id = u.id
        WHERE b.user_id = $1
        ORDER BY b.created_at DESC
      `;
    }

    const result = await client.query(query, params);
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  const client = await req.app.locals.pool.connect();
  try {
    const { id } = req.params;
    const query = `
      SELECT b.*, r.title as property_name, r.owner_id,
             u1.full_name as owner_name, u1.email as owner_email,
             u2.full_name as renter_name, u2.email as renter_email
      FROM bookings b
      JOIN rentals r ON b.rental_id = r.id
      JOIN users u1 ON r.owner_id = u1.id
      JOIN users u2 ON b.user_id = u2.id
      WHERE b.id = $1
    `;

    const result = await client.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Create a new booking
router.post('/', auth, bookingController.create);

// Update booking status
router.put('/:id/status', auth, async (req, res) => {
  const client = await req.app.locals.pool.connect();
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    const validStatuses = ['pending', 'accepted', 'rejected', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Get booking details
    const bookingResult = await client.query(
      `SELECT b.*, r.owner_id
       FROM bookings b
       LEFT JOIN rentals r ON b.rental_id = r.id
       WHERE b.id = $1`,
      [id]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const booking = bookingResult.rows[0];

    // Check if user is authorized to update the booking
    if (booking.owner_id !== userId && booking.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this booking'
      });
    }

    // Update booking status
    await client.query(
      'UPDATE bookings SET status = $1 WHERE id = $2',
      [status, id]
    );

    // Create notification service instance
    const notificationService = new NotificationService(req.app.locals.pool);

    // Send notification
    await notificationService.notifyBookingStatusChange(booking, status);

    res.json({
      success: true,
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Cancel a booking
router.post('/:id/cancel', auth, async (req, res) => {
  const client = await req.app.locals.pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const userId = req.user.id;

    // Get booking details
    const bookingResult = await client.query(
      `SELECT b.*, r.owner_id
       FROM bookings b
       JOIN rentals r ON b.rental_id = r.id
       WHERE b.id = $1`,
      [id]
    );

    if (bookingResult.rows.length === 0) {
      throw new Error('Booking not found');
    }

    const booking = bookingResult.rows[0];

    // Check if user is authorized to cancel
    if (booking.user_id !== userId && booking.owner_id !== userId) {
      throw new Error('Unauthorized to cancel this booking');
    }

    // Update booking status
    await client.query(
      'UPDATE bookings SET status = $1 WHERE id = $2',
      ['cancelled', id]
    );

    // Create notification service instance
    const notificationService = new NotificationService(req.app.locals.pool);

    // Send notification
    await notificationService.notifyBookingStatusChange(booking, 'cancelled');

    await client.query('COMMIT');
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error cancelling booking:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Webhook route (no auth required as it's called by Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), bookingController.handleWebhook);

module.exports = router;
