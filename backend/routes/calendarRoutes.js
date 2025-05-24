const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Pool } = require('pg');
const config = require('../config/config');

const pool = new Pool(config.pgConfig);

// Get calendar data (properties and services with their bookings)
router.get('/data', auth, (req, res) => {
  const userId = req.user.id;

  // Get properties with their bookings
  const propertiesQuery = `
    SELECT 
      r.id,
      r.title as name,
      r.city as location,
      CASE WHEN r.is_available THEN 'available' ELSE 'booked' END as status,
      CONCAT('$', r.price, '/night') as price,
      r.image,
      COALESCE(
        json_agg(
          json_build_object(
            'startDate', b.start_date,
            'endDate', b.end_date,
            'type', 'property',
            'status', b.status
          )
        ) FILTER (WHERE b.id IS NOT NULL),
        '[]'
      ) as bookings
    FROM rentals r
    LEFT JOIN bookings b ON r.id = b.rental_id
    WHERE r.owner_id = $1
    GROUP BY r.id
    ORDER BY r.created_at DESC;
  `;

  // Get concierge services with their bookings
  const servicesQuery = `
    SELECT 
      cs.id,
      cs.name,
      cs.category as type,
      COALESCE(
        json_agg(
          json_build_object(
            'startDate', sr.requested_date,
            'endDate', sr.requested_date,
            'type', 'service',
            'status', sr.status
          )
        ) FILTER (WHERE sr.id IS NOT NULL),
        '[]'
      ) as bookings
    FROM concierge_services cs
    LEFT JOIN service_requests sr ON cs.id = sr.service_id
    WHERE cs.owner_id = $1
    GROUP BY cs.id
    ORDER BY cs.created_at DESC;
  `;

  Promise.all([
    pool.query(propertiesQuery, [userId]),
    pool.query(servicesQuery, [userId])
  ])
    .then(([propertiesResult, servicesResult]) => {
      res.json({
        properties: propertiesResult.rows,
        services: servicesResult.rows
      });
    })
    .catch(error => {
      console.error('Error fetching calendar data:', error);
      res.status(500).json({ 
        error: 'Failed to fetch calendar data',
        details: error.message 
      });
    });
});

module.exports = router; 