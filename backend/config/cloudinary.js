const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dgoz9p4ld',
  api_key: '599637781456269',
  api_secret: 'QkPtrf1hBJ_oIpTHdGPZ3YNLcTA'
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pepper/concierge-services',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

// Create multer upload instance
const upload = multer({ storage: storage });

module.exports = {
  cloudinary,
  upload
}; 