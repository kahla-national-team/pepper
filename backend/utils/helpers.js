// Format response
const formatResponse = (res, status, message, data = null) => {
  return res.status(status).json({
    success: status >= 200 && status < 300,
    message,
    data
  });
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate random string
const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

module.exports = {
  formatResponse,
  isValidEmail,
  generateRandomString
}; 