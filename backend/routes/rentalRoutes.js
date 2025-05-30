const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
// Temporarily removing validation middleware
// const { validateRental } = require('../middleware/validation');

// Get all rentals with filtering
router.get('/', async (req, res) => {
  try {
    const { whatService, location } = req.query;
    let query = `
      SELECT 
        r.id,
        r.title,
        r.description,
        r.price,
        r.address,
        r.latitude,
        r.longitude,
        r.image,
        r.bedrooms,
        r.bathrooms,
        r.max_guests,
        u.username as provider_name,
        u.profile_image as provider_image,
        COALESCE(AVG(rv.rating), 0) as provider_rating,
        COUNT(DISTINCT rv.id) as review_count
      FROM rentals r
      LEFT JOIN users u ON r.owner_id = u.id
      LEFT JOIN bookings b ON r.id = b.rental_id
      LEFT JOIN reviews rv ON b.id = rv.booking_id
      WHERE r.is_active = true AND r.is_available = true
    `;

    const queryParams = [];
    const conditions = [];

    if (whatService) {
      conditions.push(`(r.title ILIKE $${queryParams.length + 1} OR r.description ILIKE $${queryParams.length + 1})`);
      queryParams.push(`%${whatService}%`);
    }

    if (location) {
      conditions.push(`r.address ILIKE $${queryParams.length + 1}`);
      queryParams.push(`%${location}%`);
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY r.id, u.username, u.profile_image
      ORDER BY r.created_at DESC
    `;

    const { rows } = await req.app.locals.pool.query(query, queryParams);

    // Transform the data to match the frontend format
    const formattedRentals = rows.map(rental => ({
      id: rental.id,
      type: 'stay',
      title: rental.title,
      description: rental.description,
      price: `$${rental.price}/night`,
      provider: {
        name: rental.provider_name || 'Host',
        rating: parseFloat(rental.provider_rating) || 0,
        reviewCount: parseInt(rental.review_count) || 0,
        image: rental.provider_image || '/placeholder-avatar.png',
        type: 'property_owner'
      },
      image: rental.image || '/placeholder-stay.jpg',
      location: rental.latitude && rental.longitude ? { 
        lat: parseFloat(rental.latitude), 
        lng: parseFloat(rental.longitude) 
      } : null,
      address: rental.address,
      bedrooms: rental.bedrooms || 0,
      bathrooms: rental.bathrooms || 0,
      max_guests: rental.max_guests || 1
    }));

    res.json(formattedRentals);
  } catch (error) {
    console.error('Error fetching rentals:', error);
    res.status(500).json({ message: 'Error fetching rentals' });
  }
});

// Get a single rental by ID
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await req.app.locals.pool.query(`
      SELECT 
        r.*,
        u.username as provider_name,
        u.profile_image as provider_image,
        COALESCE(AVG(rv.rating), 0) as provider_rating,
        COUNT(DISTINCT rv.id) as review_count
      FROM rentals r
      LEFT JOIN users u ON r.owner_id = u.id
      LEFT JOIN bookings b ON r.id = b.rental_id
      LEFT JOIN reviews rv ON b.id = rv.booking_id
      WHERE r.id = $1 AND r.is_active = true
      GROUP BY r.id, u.username, u.profile_image
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    const rental = rows[0];
    const formattedRental = {
      id: rental.id,
      type: 'stay',
      title: rental.title,
      description: rental.description,
      price: `$${rental.price}/night`,
      provider: {
        name: rental.provider_name || 'Host',
        rating: parseFloat(rental.provider_rating) || 0,
        reviewCount: parseInt(rental.review_count) || 0,
        image: rental.provider_image || '/placeholder-avatar.png',
        type: 'property_owner'
      },
      image: rental.image || '/placeholder-stay.jpg',
      location: rental.latitude && rental.longitude ? { 
        lat: parseFloat(rental.latitude), 
        lng: parseFloat(rental.longitude) 
      } : null,
      address: rental.address,
      bedrooms: rental.bedrooms || 0,
      bathrooms: rental.bathrooms || 0,
      max_guests: rental.max_guests || 1
    };

    res.json(formattedRental);
  } catch (error) {
    console.error('Error fetching rental:', error);
    res.status(500).json({ message: 'Error fetching rental' });
  }
});

// Use the exported functions directly
router.post('/', rentalController.create);
router.put('/:id', rentalController.update);
router.delete('/:id', rentalController.deactivate);

module.exports = router;