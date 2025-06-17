const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Create a new service request
router.post('/', async (req, res) => {
  const client = await req.app.locals.pool.connect();
  try {
    const {
      service_id,
      requested_date,
      requested_time,
      duration,
      total_amount,
      notes,
      status
    } = req.body;

    // Validate required fields
    if (!service_id || !requested_date || !requested_time || !duration || !total_amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const user_id = req.user.id;

    // Insert into service_requests table
    const result = await client.query(
      `INSERT INTO service_requests 
       (service_id, user_id, requested_date, requested_time, duration, total_amount, notes, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        service_id,
        user_id,
        requested_date,
        requested_time,
        duration,
        total_amount,
        notes || '',
        status || 'pending'
      ]
    );

    res.json({
      success: true,
      message: 'Service request created successfully',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating service request:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service request',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Get all service requests for the authenticated user
router.get('/my-requests', async (req, res) => {
  const client = await req.app.locals.pool.connect();
  try {
    const userId = req.user.id;

    const result = await client.query(
      `SELECT sr.*, s.name as service_name, s.description as service_description
       FROM service_requests sr
       JOIN concierge_services s ON sr.service_id = s.id
       WHERE s.owner_id = $1
       ORDER BY sr.requested_date DESC`,
      [userId]
    );

    res.json({
      success: true,
      requests: result.rows
    });
  } catch (error) {
    console.error('Error fetching service requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service requests',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Get user's service requests
router.get('/user', async (req, res) => {
  const client = await req.app.locals.pool.connect();
  try {
    const userId = req.user.id;

    const result = await client.query(
      `SELECT sr.*, 
              cs.name as service_name, 
              cs.category,
              u.full_name as provider_name, 
              u.email as provider_email
       FROM service_requests sr
       JOIN concierge_services cs ON sr.service_id = cs.id
       JOIN users u ON cs.owner_id = u.id
       WHERE sr.user_id = $1
       ORDER BY sr.requested_date DESC, sr.requested_time DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching user service requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user service requests',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Get service request details by ID
router.get('/:id', async (req, res) => {
  const client = await req.app.locals.pool.connect();
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await client.query(
      `SELECT sr.*, s.name as service_name, s.description as service_description
       FROM service_requests sr
       JOIN concierge_services s ON sr.service_id = s.id
       WHERE sr.id = $1 AND s.owner_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    res.json({
      success: true,
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching service request:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service request',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Update service request status
router.put('/:id/status', async (req, res) => {
  const client = await req.app.locals.pool.connect();
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    if (!['pending', 'accepted', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const result = await client.query(
      `UPDATE service_requests sr
       SET status = $1
       FROM concierge_services s
       WHERE sr.id = $2 AND sr.service_id = s.id AND s.owner_id = $3
       RETURNING sr.*`,
      [status, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    res.json({
      success: true,
      message: 'Service request status updated successfully',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating service request status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service request status',
      error: error.message
    });
  } finally {
    client.release();
  }
});

module.exports = router;
