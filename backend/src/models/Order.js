const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  serviceTax: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, default: 'EVC Plus' },
  paymentPhone: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  orderId: { type: String, unique: true }
}, { timestamps: true });

// Generate random orderId (Tusaale: DW-5421)
OrderSchema.pre('save', function(next) {
  if (!this.orderId) {
    this.orderId = 'DW-' + Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);