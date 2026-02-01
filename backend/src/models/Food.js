const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  status: { 
    type: String, 
    enum: ['Available', 'Low Stock', 'Out of Stock'], 
    default: 'Available' 
  },
  rating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Food', FoodSchema);