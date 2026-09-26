const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    default: 'Barwaaqo Restaurant',
  },
  tagline: {
    type: String,
    default: 'Modern Dining & Authentic Flavors',
  },
  currency: {
    type: String,
    default: 'USD',
  },
  currencySymbol: {
    type: String,
    default: '$',
  },
  taxPercentage: {
    type: Number,
    default: 5,
  },
  deliveryFee: {
    type: Number,
    default: 2.0,
  },
  contactEmail: {
    type: String,
    default: 'contact@barwaaqorestaurant.com',
  },
  contactPhone: {
    type: String,
    default: '+252 61 0000000',
  },
  address: {
    type: String,
    default: 'KM4, Maka Al-Mukarama Road, Mogadishu, Somalia',
  },
  openingHours: {
    type: String,
    default: 'Mon - Sun: 08:00 AM - 11:00 PM',
  },
  allowReservations: {
    type: Boolean,
    default: true,
  },
  allowOnlineOrders: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
