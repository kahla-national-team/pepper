const validateServiceRequest = (req, res, next) => {
  const { name, user_id, service_id, start_date } = req.body;
  const errors = [];

  if (!name) errors.push('name is required');
  if (!user_id) errors.push('user_id is required');
  if (!service_id) errors.push('service_id is required');
  if (!start_date) errors.push('start_date is required');

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

module.exports = {
  validateServiceRequest
}; 