const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @desc    Register a new vendor
 * @route   POST /api/vendors/register
 * @access  Public
 */
const registerVendor = async (req, res) => {
  try {
    const { name, phoneNumber, location, market, stallNumber, primaryProduce, preferredLanguage } = req.body;

    // Check if vendor already exists
    const vendorExists = await Vendor.findOne({ phoneNumber });
    if (vendorExists) {
      return res.status(400).json({ message: 'Vendor already exists with this phone number' });
    }

    // Create vendor
    const vendor = await Vendor.create({
      name,
      phoneNumber,
      location: {
        type: 'Point',
        coordinates: location // Expecting [longitude, latitude]
      },
      market,
      stallNumber,
      primaryProduce,
      preferredLanguage: preferredLanguage || 'en'
    });

    if (vendor) {
      res.status(201).json({
        _id: vendor._id,
        name: vendor.name,
        phoneNumber: vendor.phoneNumber,
        market: vendor.market,
        token: generateToken(vendor._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid vendor data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Authenticate a vendor
 * @route   POST /api/vendors/login
 * @access  Public
 */
const loginVendor = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Check for vendor
    const vendor = await Vendor.findOne({ phoneNumber });
    if (vendor && (await bcrypt.compare(password, vendor.password))) {
      res.json({
        _id: vendor._id,
        name: vendor.name,
        phoneNumber: vendor.phoneNumber,
        market: vendor.market,
        token: generateToken(vendor._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid phone number or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get vendor profile
 * @route   GET /api/vendors/profile
 * @access  Private
 */
const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendorId).select('-password');
    if (vendor) {
      res.json(vendor);
    } else {
      res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update vendor profile
 * @route   PUT /api/vendors/profile
 * @access  Private
 */
const updateVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendorId);

    if (vendor) {
      vendor.name = req.body.name || vendor.name;
      vendor.phoneNumber = req.body.phoneNumber || vendor.phoneNumber;
      vendor.market = req.body.market || vendor.market;
      vendor.stallNumber = req.body.stallNumber || vendor.stallNumber;
      vendor.primaryProduce = req.body.primaryProduce || vendor.primaryProduce;
      vendor.location = {
        type: 'Point',
        coordinates: req.body.location || vendor.location.coordinates
      };
      vendor.preferredLanguage = req.body.preferredLanguage || vendor.preferredLanguage;

      const updatedVendor = await vendor.save();
      res.json({
        _id: updatedVendor._id,
        name: updatedVendor.name,
        phoneNumber: updatedVendor.phoneNumber,
        market: updatedVendor.market,
        token: generateToken(updatedVendor._id)
      });
    } else {
      res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Generate JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerVendor,
  loginVendor,
  getVendorProfile,
  updateVendorProfile
};