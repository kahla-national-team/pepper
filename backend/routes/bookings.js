const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken } = require('../middleware/auth');
const pool = require('../db');

// Get all bookings for a user
router.get('/', authenticateToken, async (req, res) => {
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

// Get a specific booking
router.get('/:id', authenticateToken, async (req, res) => {
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
router.post('/', authenticateToken, bookingController.createBooking);

// Update booking status
router.patch('/:id/status', authenticateToken, bookingController.updateBookingStatus);

// Cancel a booking
router.post('/:id/cancel', authenticateToken, async (req, res) => {
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

router.get('/owner', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching bookings for user:', userId);
    
    const query = `
      SELECT b.*, 
             p.title as property_title,
             u.name as guest_name
      FROM bookings b
      LEFT JOIN properties p ON b.property_id = p.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE p.owner_id = $1
      ORDER BY b.created_at DESC
    `;
    
    console.log('Executing query with userId:', userId);
    const result = await pool.query(query, [userId]);
    console.log('Query result:', result.rows);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Detailed error in /owner route:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Get bookings for a specific user by ID
router.get('/user/:userId', authenticateToken, async (req, res) => {
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

module.exports = router; 