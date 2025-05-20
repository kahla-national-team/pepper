const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Get all rentals
exports.getAllRentals = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM rentals ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching rentals:', err);
        res.status(500).json({ message: 'Error fetching rentals' });
    }
};

// Get rental by ID
exports.getRentalById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM rentals WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rental not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching rental:', err);
        res.status(500).json({ message: 'Error fetching rental' });
    }
};

// Create new rental
exports.createRental = async (req, res) => {
    const { title, description, price, location } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO rentals (title, description, price, location, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [title, description, price, location]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating rental:', err);
        res.status(500).json({ message: 'Error creating rental' });
    }
};

// Update rental
exports.updateRental = async (req, res) => {
    const { id } = req.params;
    const { title, description, price, location } = req.body;
    try {
        const result = await pool.query(
            'UPDATE rentals SET title = $1, description = $2, price = $3, location = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
            [title, description, price, location, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rental not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating rental:', err);
        res.status(500).json({ message: 'Error updating rental' });
    }
};

// Delete rental
exports.deleteRental = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM rentals WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rental not found' });
        }
        res.json({ message: 'Rental deleted successfully' });
    } catch (err) {
        console.error('Error deleting rental:', err);
        res.status(500).json({ message: 'Error deleting rental' });
    }
};
