const express = require('express');
const multer = require('multer');
const path = require('path');
const { predictShelfLife } = require('../controllers/shelfLifeController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route for shelf-life prediction
router.post('/predict', upload.single('produceImage'), predictShelfLife);

module.exports = router;