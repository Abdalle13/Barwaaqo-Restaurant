const Order = require('../models/Order');
const User = require('../models/User');
const Table = require('../models/Table');
const sendEmail = require('../utils/sendEmail');

// @desc    CREATE New Order
// @route   POST /api/orders
// @access  Private (Customer/User)
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentPhone,
      paymentMethod,
      notes,
      customerId,
      district,
      landmark,
      alternativePhone,
      transactionId,
      table,
      paymentStatus: requestedPaymentStatus,
    } = req.body;
    const orderType = ['DELIVERY', 'TAKEAWAY', 'DINE_IN'].includes(req.body.orderType)
      ? req.body.orderType
      : 'DELIVERY';

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your order cart is empty' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: orderType === 'DELIVERY' ? 'Please provide a delivery address' : 'Please provide a table or pickup location' });
    }

    if (!paymentPhone) {
      return res.status(400).json({ success: false, message: 'Please provide a phone number' });
    }

    // Calculate subtotal, delivery fee, tax, and total
    const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
    const deliveryFee = orderType === 'DELIVERY' ? 2.0 : 0;
    const serviceTax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
    const totalAmount = Math.round((subtotal + deliveryFee + serviceTax) * 100) / 100;

    let orderUserId = req.user._id;
    const isStaff = ['ADMIN', 'RECEPTIONIST'].includes(req.user.role?.name);
    if (customerId && isStaff) {
      const selectedCustomer = await User.findOne({ _id: customerId }).populate('role', 'name');
      if (!selectedCustomer || selectedCustomer.role?.name !== 'CUSTOMER') {
        return res.status(400).json({ success: false, message: 'Please select a valid customer' });
      }
      orderUserId = selectedCustomer._id;
    }

    const validPaymentMethods = ['evc_plus', 'edahab', 'pay_on_delivery', 'cash_on_delivery'];
    const resolvedPaymentMethod = validPaymentMethods.includes(paymentMethod)
      ? paymentMethod
      : 'evc_plus';

    // Payment status: if staff explicitly provides it (e.g. POS), use it; otherwise auto-set Paid for mobile money or Pending
    let resolvedPaymentStatus = 'Pending';
    if (requestedPaymentStatus && isStaff) {
      resolvedPaymentStatus = requestedPaymentStatus;
    } else if (resolvedPaymentMethod === 'evc_plus' || resolvedPaymentMethod === 'edahab') {
      resolvedPaymentStatus = 'Paid';
    }

    const order = new Order({
      user: orderUserId,
      items,
      subtotal,
      deliveryFee,
      serviceTax,
      totalAmount,
      orderType,
      table: orderType === 'DINE_IN' && table ? table : null,
      transactionId: transactionId ? String(transactionId).trim() : '',
      district: district || 'Hodan',
      landmark: landmark || '',
      shippingAddress,
      paymentMethod: resolvedPaymentMethod,
      paymentPhone,
      alternativePhone: alternativePhone || '',
      paymentStatus: resolvedPaymentStatus,
      status: 'Pending',
      notes: notes || '',
    });

    const createdOrder = await order.save();

    // If dine-in and a table was selected, mark table as Occupied
    if (orderType === 'DINE_IN' && table) {
      await Table.findByIdAndUpdate(table, { status: 'Occupied' }).catch(() => {});
    }

    const populated = await Order.findById(createdOrder._id)
      .populate('user', 'name email phone')
      .populate('table', 'tableNumber location capacity status')
      .populate('assignedDeliveryBoy', 'name phone email status')
      .populate('items.food', 'name image price');

    // Attempt to send customer email notification in background
    try {
      if (req.user.email && orderUserId.toString() === req.user._id.toString()) {
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
      .populate('table', 'tableNumber location capacity status')
      .populate('assignedDeliveryBoy', 'name phone email status')
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
      .populate('user', 'name email phone')
      .populate('assignedDeliveryBoy', 'name phone email status')
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
      .populate('table', 'tableNumber location capacity status')
      .populate('assignedDeliveryBoy', 'name phone email status')
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

// @desc    Track Order by item name, orderId, or latest
// @route   GET /api/orders/track/:orderId
// @access  Public
exports.trackOrderByCode = async (req, res) => {
  try {
    const rawParam = req.params.orderId ? req.params.orderId.trim() : '';

    const Food = require('../models/Food');
    const User = require('../models/User');

    let order = null;

    // 1. If 'latest' or 'active' or empty, fetch the most recent active/pending order
    if (!rawParam || rawParam.toLowerCase() === 'latest' || rawParam.toLowerCase() === 'active') {
      // SECURITY: Only return orders belonging to the currently authenticated user
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Please log in to track your orders' });
      }

      order = await Order.findOne({ user: req.user._id, status: { $ne: 'Cancelled' } })
        .sort({ createdAt: -1 })
        .select('orderId orderType district landmark alternativePhone status items totalAmount createdAt shippingAddress paymentPhone paymentMethod isDelivered deliveredAt user assignedDeliveryBoy')
        .populate('user', 'name phone email')
        .populate('assignedDeliveryBoy', 'name phone email status')
        .populate('items.food', 'name image price');

      if (!order) {
        order = await Order.findOne({ user: req.user._id })
          .sort({ createdAt: -1 })
          .select('orderId orderType district landmark alternativePhone status items totalAmount createdAt shippingAddress paymentPhone paymentMethod isDelivered deliveredAt user assignedDeliveryBoy')
          .populate('user', 'name phone email')
          .populate('assignedDeliveryBoy', 'name phone email status')
          .populate('items.food', 'name image price');
      }

      if (!order) {
        return res.status(404).json({ success: false, message: 'You have no orders yet' });
      }

      return res.status(200).json({ success: true, data: order });
    }

    // 2. Find any food IDs matching the dish name keyword
    const matchedFoods = await Food.find({ name: { $regex: rawParam, $options: 'i' } }).select('_id');
    const foodIds = matchedFoods.map((f) => f._id);

    // 3. Search orders by exact/partial orderId, items.name, food ID, or phone
    order = await Order.findOne({
      $or: [
        { orderId: new RegExp(`^${rawParam}$`, 'i') },
        { orderId: { $regex: rawParam, $options: 'i' } },
        { 'items.name': { $regex: rawParam, $options: 'i' } },
        { 'items.food': { $in: foodIds } },
        { paymentPhone: { $regex: rawParam, $options: 'i' } },
      ],
    })
      .sort({ createdAt: -1 })
      .select('orderId orderType district landmark alternativePhone status items totalAmount createdAt shippingAddress paymentPhone paymentMethod isDelivered deliveredAt user assignedDeliveryBoy')
      .populate('user', 'name phone email')
      .populate('assignedDeliveryBoy', 'name phone email status')
      .populate('items.food', 'name image price');

    // 4. Fallback search by customer name
    if (!order) {
      const matchedUsers = await User.find({ name: { $regex: rawParam, $options: 'i' } }).select('_id');
      if (matchedUsers.length > 0) {
        order = await Order.findOne({ user: { $in: matchedUsers.map((u) => u._id) } })
          .sort({ createdAt: -1 })
          .select('orderId orderType district landmark alternativePhone status items totalAmount createdAt shippingAddress paymentPhone paymentMethod isDelivered deliveredAt user assignedDeliveryBoy')
          .populate('user', 'name phone email')
          .populate('assignedDeliveryBoy', 'name phone email status')
          .populate('items.food', 'name image price');
      }
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `No order found matching "${rawParam}". Try searching for another dish name (e.g. Bariis, Goat, Suqaar).`,
      });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    UPDATE Order Status & Assign Driver
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const { status, paymentStatus, assignedDeliveryBoy } = req.body;

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

    if (assignedDeliveryBoy !== undefined) {
      order.assignedDeliveryBoy = assignedDeliveryBoy || null;
      if (assignedDeliveryBoy && order.status === 'Pending') {
        order.status = 'Out for Delivery';
      }
    }

    const updatedOrder = await order.save();
    const populated = await Order.findById(updatedOrder._id)
      .populate('user', 'name email phone')
      .populate('table', 'tableNumber location capacity status')
      .populate('assignedDeliveryBoy', 'name phone email status')
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