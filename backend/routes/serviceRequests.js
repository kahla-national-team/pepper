const express = require('express');
const router = express.Router();
const pool = require('../db');
const { validateServiceRequest } = require('../middleware/validation');

// Create a new service request
router.post('/', validateServiceRequest, async (req, res) => {
  const client = await pool.connect();
  
  try {
    // Log the incoming request
    console.log('Received service request:', req.body);

    const {
      name,
      service_id,
      start_date,
      notes,
      status
    } = req.body;

    // Get user_id from the JWT token
    const user_id = req.user.id; // Assuming you have auth middleware

    // Insert into service_requests table
    const result = await client.query(
      `INSERT INTO service_requests (
        name,
        user_id,
        service_id,
        start_date,
        notes,
        status,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *`,
      [name, user_id, service_id, start_date, notes, status]
    );

    res.status(201).json({
      success: true,
      message: 'Service request created successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error creating service request:', error);
    
    // Handle specific database errors
    if (error.code === '23502') { // not-null violation
      res.status(400).json({
        success: false,
        message: `${error.column} is required`,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creating service request',
        error: error.message
      });
    }
  } finally {
    client.release();
  }
});

module.exports = router; 