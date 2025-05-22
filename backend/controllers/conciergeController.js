const Concierge = require('../models/Concierge');

// Create a new concierge service
exports.createConcierge = async (req, res) => {
    try {
        const { name, category, description, price, duration_minutes } = req.body;
        
        // Basic validation
        if (!name || !category || !price) {
            return res.status(400).json({
                success: false,
                message: 'Name, category and price are required'
            });
        }

        // Price validation
        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Price must be greater than 0'
            });
        }

        // Duration validation if provided
        if (duration_minutes && duration_minutes <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Duration must be greater than 0 minutes'
            });
        }

        const serviceData = {
            owner_id: req.user.id, // Assuming user info is attached by auth middleware
            name,
            category,
            description,
            price,
            duration_minutes
        };

        const concierge = await Concierge.create(serviceData);
        res.status(201).json({
            success: true,
            data: concierge
        });
    } catch (error) {
        console.error('Error creating concierge service:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating concierge service'
        });
    }
};

// Get all concierge services
exports.getAllConcierge = async (req, res) => {
    try {
        const concierges = await Concierge.getAll();
        res.status(200).json({
            success: true,
            data: concierges
        });
    } catch (error) {
        console.error('Error fetching concierge services:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching concierge services'
        });
    }
};

// Get a single concierge service
exports.getConciergeById = async (req, res) => {
    try {
        const concierge = await Concierge.getById(req.params.id);
        if (!concierge) {
            return res.status(404).json({
                success: false,
                message: 'Concierge service not found'
            });
        }
        res.status(200).json({
            success: true,
            data: concierge
        });
    } catch (error) {
        console.error('Error fetching concierge service:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching concierge service'
        });
    }
};

// Update a concierge service
exports.updateConcierge = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const service = await Concierge.getById(serviceId);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Concierge service not found'
            });
        }

        // Check if user is the owner
        if (service.owner_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this service'
            });
        }

        const { name, category, description, price, duration_minutes, is_active } = req.body;

        // Validation
        if (price && price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Price must be greater than 0'
            });
        }

        if (duration_minutes && duration_minutes <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Duration must be greater than 0 minutes'
            });
        }

        const concierge = await Concierge.update(serviceId, {
            name,
            category,
            description,
            price,
            duration_minutes,
            is_active
        });

        res.status(200).json({
            success: true,
            data: concierge
        });
    } catch (error) {
        console.error('Error updating concierge service:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating concierge service'
        });
    }
};

// Delete a concierge service
exports.deleteConcierge = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const service = await Concierge.getById(serviceId);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Concierge service not found'
            });
        }

        // Check if user is the owner
        if (service.owner_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this service'
            });
        }

        await Concierge.delete(serviceId);
        res.status(200).json({
            success: true,
            message: 'Concierge service deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting concierge service:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting concierge service'
        });
    }
};