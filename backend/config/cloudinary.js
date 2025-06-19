const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dgoz9p4ld',
  api_key: process.env.CLOUDINARY_API_KEY || '599637781456269',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'QkPtrf1hBJ_oIpTHdGPZ3YNLcTA'
});

// Configure multer storage with Cloudinary for concierge service photos
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pepper/concierge_services',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

module.exports = {
  upload,
  cloudinary
}; 