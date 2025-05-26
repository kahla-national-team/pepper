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
        r.price_per_night,
        r.address,
        r.latitude,
        r.longitude,
        r.image_url,
        u.name as provider_name,
        u.avatar_url as provider_image,
        COALESCE(AVG(rv.rating), 0) as provider_rating,
        COUNT(rv.id) as review_count
      FROM rentals r
      LEFT JOIN users u ON r.provider_id = u.id
      LEFT JOIN reviews rv ON r.id = rv.rental_id
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
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY r.id, u.name, u.avatar_url
      ORDER BY r.id DESC
    `;

    const { rows } = await req.app.locals.pool.query(query, queryParams);

    // Transform the data to match the frontend format
    const formattedRentals = rows.map(rental => ({
      id: rental.id,
      type: 'stay',
      title: rental.title,
      description: rental.description,
      price: `$${rental.price_per_night}/night`,
      provider: {
        name: rental.provider_name || 'Host',
        rating: parseFloat(rental.provider_rating) || 0,
        reviewCount: parseInt(rental.review_count) || 0,
        image: rental.provider_image || '/placeholder-avatar.png',
        type: 'property_owner'
      },
      image: rental.image_url || '/placeholder-stay.jpg',
      location: { 
        lat: parseFloat(rental.latitude), 
        lng: parseFloat(rental.longitude) 
      },
      address: rental.address
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
        u.name as provider_name,
        u.avatar_url as provider_image,
        COALESCE(AVG(rv.rating), 0) as provider_rating,
        COUNT(rv.id) as review_count
      FROM rentals r
      LEFT JOIN users u ON r.provider_id = u.id
      LEFT JOIN reviews rv ON r.id = rv.rental_id
      WHERE r.id = $1
      GROUP BY r.id, u.name, u.avatar_url
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
      price: `$${rental.price_per_night}/night`,
      provider: {
        name: rental.provider_name || 'Host',
        rating: parseFloat(rental.provider_rating) || 0,
        reviewCount: parseInt(rental.review_count) || 0,
        image: rental.provider_image || '/placeholder-avatar.png',
        type: 'property_owner'
      },
      image: rental.image_url || '/placeholder-stay.jpg',
      location: { 
        lat: parseFloat(rental.latitude), 
        lng: parseFloat(rental.longitude) 
      },
      address: rental.address
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