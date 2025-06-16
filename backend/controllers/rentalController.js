const Rental = require('../models/rentalModel');

exports.getAll = async (req, res, next) => {
  try {
    const rentalModel = new Rental(req.app.locals.pool);
    const rentals = await rentalModel.findAllActive();
    res.json(rentals);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const rentalModel = new Rental(req.app.locals.pool);
    const rental = await rentalModel.findById(req.params.id);
    
    console.log('Rental data from database:', rental);
    console.log('Rental price field:', rental?.price, 'Type:', typeof rental?.price);
    
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    res.json(rental);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const rentalModel = new Rental(req.app.locals.pool);
    const newRental = await rentalModel.create(req.body);
    res.status(201).json(newRental);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const rentalModel = new Rental(req.app.locals.pool);
    const updated = await rentalModel.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Rental not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deactivate = async (req, res, next) => {
  try {
    const rentalModel = new Rental(req.app.locals.pool);
    const deactivated = await rentalModel.deactivate(req.params.id);
    if (!deactivated) return res.status(404).json({ message: 'Rental not found' });
    res.json({ message: 'Rental deactivated' });
  } catch (err) {
    next(err);
  }
};

exports.getRentalLocations = async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query(`
      SELECT 
        id,
        title,
        address,
        latitude,
        longitude,
        price,
        image,
        category
      FROM rentals 
      WHERE is_active = true 
      AND latitude IS NOT NULL 
      AND longitude IS NOT NULL
    `);

    const rentals = result.rows.map(rental => ({
      id: rental.id,
      title: rental.title,
      address: rental.address,
      location: {
        lat: parseFloat(rental.latitude),
        lng: parseFloat(rental.longitude)
      },
      price: rental.price,
      image: rental.image,
      category: rental.category
    }));

    res.json(rentals);
  } catch (error) {
    console.error('Error fetching rental locations:', error);
    res.status(500).json({ message: 'Error fetching rental locations' });
  }
};
