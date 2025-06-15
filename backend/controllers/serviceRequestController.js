const NotificationService = require('../services/notificationService');

const serviceRequestController = {
  // Create a new service request
  createServiceRequest: async (req, res) => {
    const client = await req.app.locals.pool.connect();
    try {
      await client.query('BEGIN');

      const { service_id, description, preferred_date } = req.body;
      const user_id = req.user.id;

      // Get service details
      const serviceResult = await client.query(
        `SELECT s.*, u.full_name as provider_name, u.id as provider_id
         FROM services s
         JOIN users u ON s.provider_id = u.id
         WHERE s.id = $1`,
        [service_id]
      );

      if (serviceResult.rows.length === 0) {
        throw new Error('Service not found');
      }

      const service = serviceResult.rows[0];

      // Create service request
      const requestResult = await client.query(
        `INSERT INTO service_requests (user_id, service_id, description, preferred_date, status)
         VALUES ($1, $2, $3, $4, 'pending')
         RETURNING *`,
        [user_id, service_id, description, preferred_date]
      );

      const serviceRequest = requestResult.rows[0];

      // Get user details for notification
      const userResult = await client.query(
        'SELECT full_name FROM users WHERE id = $1',
        [user_id]
      );
      const user = userResult.rows[0];

      // Create notification service instance
      const notificationService = new NotificationService(req.app.locals.pool);

      // Send notification
      await notificationService.notifyNewServiceRequest({
        ...serviceRequest,
        service_name: service.title,
        user_name: user.full_name,
        provider_id: service.provider_id
      });

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        data: serviceRequest,
        message: 'Service request created successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating service request:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating service request',
        error: error.message
      });
    } finally {
      client.release();
    }
  },

  // Update service request status
  updateServiceRequestStatus: async (req, res) => {
    const client = await req.app.locals.pool.connect();
    try {
      await client.query('BEGIN');

      const { id } = req.params;
      const { status } = req.body;

      // Get service request details
      const requestResult = await client.query(
        `SELECT sr.*, s.title as service_name, s.provider_id,
                u.full_name as user_name, u.id as user_id
         FROM service_requests sr
         JOIN services s ON sr.service_id = s.id
         JOIN users u ON sr.user_id = u.id
         WHERE sr.id = $1`,
        [id]
      );

      if (requestResult.rows.length === 0) {
        throw new Error('Service request not found');
      }

      const serviceRequest = requestResult.rows[0];

      // Update service request status
      await client.query(
        'UPDATE service_requests SET status = $1 WHERE id = $2',
        [status, id]
      );

      // Create notification service instance
      const notificationService = new NotificationService(req.app.locals.pool);

      // Send notification
      await notificationService.notifyServiceRequestStatus(serviceRequest, status);

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Service request status updated successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating service request status:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating service request status',
        error: error.message
      });
    } finally {
      client.release();
    }
  }
};

module.exports = serviceRequestController; 