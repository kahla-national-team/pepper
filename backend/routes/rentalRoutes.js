const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
// Temporarily removing validation middleware
// const { validateRental } = require('../middleware/validation');

// Get all rentals with filtering
router.get('/', async (req, res) => {
  try {
    const { destination, guests, rating, favorites, priceRange, duration } = req.query;
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
      LEFT JOIN reviews rv ON r.id = rv.rental_id
      WHERE r.is_active = true AND r.is_available = true
    `;

    const queryParams = [];
    const conditions = [];

    if (destination && destination.trim()) {
      conditions.push(`(r.address ILIKE $${queryParams.length + 1} OR r.city ILIKE $${queryParams.length + 1})`);
      queryParams.push(`%${destination}%`);
    }

    if (guests) {
      const totalGuests = parseInt(guests.adults || 0) + parseInt(guests.children || 0) + parseInt(guests.babies || 0);
      if (totalGuests > 0) {
        conditions.push(`r.max_guests >= $${queryParams.length + 1}`);
        queryParams.push(totalGuests);
      }
    }

    if (favorites === 'true') {
      conditions.push(`r.is_favorite = true`);
    }

    if (priceRange) {
      if (priceRange.min && priceRange.min > 0) {
        conditions.push(`r.price >= $${queryParams.length + 1}`);
        queryParams.push(parseFloat(priceRange.min));
      }
      if (priceRange.max && priceRange.max > 0) {
        conditions.push(`r.price <= $${queryParams.length + 1}`);
        queryParams.push(parseFloat(priceRange.max));
      }
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY r.id, u.username, u.profile_image
    `;

    // Add HAVING clause for rating filter (aggregate function)
    if (rating && rating > 0) {
      query += ` HAVING COALESCE(AVG(rv.rating), 0) >= $${queryParams.length + 1}`;
      queryParams.push(parseFloat(rating));
    }

    query += ` ORDER BY r.created_at DESC`;

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
    res.status(500).json({ message: 'Error fetching rentals', error: error.message });
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
      LEFT JOIN reviews rv ON r.id = rv.rental_id
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

// Get reviews for a rental
router.get('/:id/reviews', async (req, res) => {
  try {
    const { rows } = await req.app.locals.pool.query(`
      SELECT 
        r.*,
        u.username,
        u.profile_image
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.rental_id = $1
      ORDER BY r.created_at DESC
    `, [req.params.id]);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching rental reviews:', error);
    res.status(500).json({ message: 'Error fetching rental reviews' });
  }
});

// Get rentals by user/owner ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { rows } = await req.app.locals.pool.query(
      `SELECT * FROM rentals WHERE owner_id = $1 AND is_active = true`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching rentals by user:', error);
    res.status(500).json({ message: 'Error fetching rentals by user' });
  }
});

// Use the exported functions directly
router.post('/', rentalController.create);
router.put('/:id', rentalController.update);
router.delete('/:id', rentalController.deactivate);

module.exports = router;