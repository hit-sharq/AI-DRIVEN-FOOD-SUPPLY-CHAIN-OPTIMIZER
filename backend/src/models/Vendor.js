const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // 'Point' for GeoJSON
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  market: {
    type: String,
    required: true,
    trim: true
  },
  stallNumber: {
    type: String,
    trim: true
  },
  primaryProduce: [{
    type: String,
    trim: true
  }],
  registrationDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Preferences
  preferredLanguage: {
    type: String,
    enum: ['en', 'sw'],
    default: 'en'
  },
  notificationsEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes
vendorSchema.index({ location: '2dsphere' });
vendorSchema.index({ phoneNumber: 1 });
vendorSchema.index({ market: 1 });

module.exports = mongoose.model('Vendor', vendorSchema);