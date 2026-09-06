const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  customerName: {
    type: String,
    required: [true, 'Please provide the guest name'],
    trim: true,
  },
  customerEmail: {
    type: String,
    required: [true, 'Please provide an email address'],
    lowercase: true,
    trim: true,
  },
  customerPhone: {
    type: String,
    required: [true, 'Please provide a contact phone number'],
    trim: true,
  },
  guests: {
    type: Number,
    required: [true, 'Please specify the number of guests'],
    min: [1, 'At least 1 guest required'],
    max: [20, 'For groups larger than 20, please contact management directly'],
  },
  reservationDate: {
    type: Date,
    required: [true, 'Please provide the reservation date'],
  },
  reservationTime: {
    type: String,
    required: [true, 'Please provide the reservation time slot (e.g. 19:00)'],
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
  },
  specialRequests: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);
