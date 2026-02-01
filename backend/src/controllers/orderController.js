const Order = require('../models/Order');

// @desc    CREATE New Order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, paymentPhone, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Dalabkaagu waa madhan yahay' });
    }

    const order = new Order({
      user: req.user._id,
      items, 
      shippingAddress,
      totalAmount, 
      paymentPhone, 
      paymentMethod
    });

    const createdOrder = await order.save();
    res.status(201).json({ success: true, data: createdOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    GET All Orders (Admin Only) - Added populate for items.food
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.food', 'name image price'); // Halkan ayaa muhiim ah
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    GET My Orders (Customer Only)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.food', 'name image'); // In macmiilku arko sawirka iyo magaca cuntada
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    GET Single Order (Admin or Owner)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.food', 'name image price'); // Muhiim u ah Order Details Screen

    if (!order) {
      return res.status(404).json({ success: false, message: 'Dalabka lama helin' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    UPDATE Order Status (Admin Only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Waxaan u oggolaanaynaa 'Completed' ama 'Delivered'
      order.status = req.body.status || order.status;
      
      if (req.body.status === 'Delivered' || req.body.status === 'Completed') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
      
      const updatedOrder = await order.save();
      res.json({ success: true, data: updatedOrder });
    } else {
      res.status(404).json({ success: false, message: 'Dalabka lama helin' });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};