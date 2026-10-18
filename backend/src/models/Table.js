const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: [true, 'Please provide a table number or name'],
    unique: true,
    trim: true,
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide seating capacity'],
    min: [1, 'Capacity must be at least 1 person'],
  },
  location: {
    type: String,
    enum: ['Main Hall', 'Terrace', 'VIP Room', 'Window Side', 'Outdoor Patio'],
    default: 'Main Hall',
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Reserved'],
    default: 'Available',
  },
  notes: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Table', TableSchema);
