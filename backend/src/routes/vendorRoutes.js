const express = require('express');
const { registerVendor, loginVendor, getVendorProfile, updateVendorProfile } = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerVendor);
router.post('/login', loginVendor);
router.get('/profile', protect, getVendorProfile);
router.put('/profile', protect, updateVendorProfile);

module.exports = router;