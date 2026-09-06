const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderId: {
    type: String,
    unique: true,
  },
  items: [{
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
    },
    name: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: true,
    },
  }],
  subtotal: {
    type: Number,
    default: 0,
  },
  serviceTax: {
    type: Number,
    default: 0,
  },
  deliveryFee: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    type: String,
    required: [true, 'Please provide delivery address'],
  },
  paymentMethod: {
    type: String,
    enum: ['evc_plus', 'cash_on_delivery'],
    default: 'evc_plus',
  },
  paymentPhone: {
    type: String,
    required: [true, 'Please provide payment/contact phone number'],
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Out for Delivery', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  notes: {
    type: String,
    default: '',
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
}, { timestamps: true });

// Generate unique Barwaaqo orderId (Example: BW-7824)
OrderSchema.pre('save', function(next) {
  if (!this.orderId) {
    this.orderId = 'BW-' + Math.floor(10000 + Math.random() * 90000);
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);