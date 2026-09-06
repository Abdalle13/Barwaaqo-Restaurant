const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

// @desc    CREATE New Order
// @route   POST /api/orders
// @access  Private (Customer/User)
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentPhone, paymentMethod, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your order cart is empty' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Please provide a delivery address' });
    }

    if (!paymentPhone) {
      return res.status(400).json({ success: false, message: 'Please provide a phone number' });
    }

    // Calculate subtotal, delivery fee, tax, and total
    const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
    const deliveryFee = 2.0; // Standard $2.00 delivery
    const serviceTax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
    const totalAmount = Math.round((subtotal + deliveryFee + serviceTax) * 100) / 100;

    const order = new Order({
      user: req.user._id,
      items,
      subtotal,
      deliveryFee,
      serviceTax,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod === 'cash_on_delivery' ? 'cash_on_delivery' : 'evc_plus',
      paymentPhone,
      paymentStatus: paymentMethod === 'evc_plus' ? 'Paid' : 'Pending', // EVC simulated as immediate payment
      status: 'Pending',
      notes: notes || '',
    });

    const createdOrder = await order.save();
    const populated = await Order.findById(createdOrder._id)
      .populate('user', 'name email phone')
      .populate('items.food', 'name image price');

    // Attempt to send customer email notification in background
    try {
      if (req.user.email) {
        sendEmail({
          email: req.user.email,
          subject: `Order Confirmed: ${createdOrder.orderId} - Barwaaqo Restaurant`,
          message: `Dear ${req.user.name},\n\nThank you for your order (${createdOrder.orderId}) at Barwaaqo Restaurant!\nTotal Amount: $${totalAmount}\nDelivery Address: ${shippingAddress}\nStatus: Pending\n\nWe are preparing your fresh meal now!`,
        }).catch((err) => console.log('Email delivery skipped:', err.message));
      }
    } catch (emailErr) {
      // Don't fail the order if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: populated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    GET All Orders (Admin Only) with Pagination & Status Filter
// @route   GET /api/orders
// @access  Private (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    let filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('items.food', 'name image price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: orders.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    GET My Orders (Customer Only)
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.food', 'name image price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    GET Single Order By ID
// @route   GET /api/orders/:id
// @access  Private (Admin or Order Owner)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.food', 'name image price');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify ownership if not admin
    const isAdmin = req.user.role && req.user.role.name === 'ADMIN';
    const isOwner = order.user && order.user._id.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Track Order by orderId (e.g. BW-10293)
// @route   GET /api/orders/track/:orderId
// @access  Public
exports.trackOrderByCode = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId.toUpperCase() })
      .select('orderId status items totalAmount createdAt shippingAddress isDelivered deliveredAt')
      .populate('items.food', 'name image price');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found with this code' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    UPDATE Order Status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const { status, paymentStatus } = req.body;

    if (status) {
      order.status = status;
      if (status === 'Completed') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    const updatedOrder = await order.save();
    const populated = await Order.findById(updatedOrder._id)
      .populate('user', 'name email phone')
      .populate('items.food', 'name image price');

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: populated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};