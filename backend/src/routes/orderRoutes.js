const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authoriz');
const { PERMISSIONS } = require('../seeds/constants');

const {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  trackOrderByCode,
  updateOrderStatus,
} = require('../controllers/orderController');

// Public tracking
router.get('/track/:orderId', trackOrderByCode);

// Customer orders
router.post('/', protect, authorize(PERMISSIONS.CREATE_ORDER), createOrder);
router.get('/my-orders', protect, authorize(PERMISSIONS.VIEW_MY_ORDERS), getMyOrders);

// Admin orders
router.get('/', protect, authorize(PERMISSIONS.VIEW_ALL_ORDERS), getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize(PERMISSIONS.UPDATE_ORDER_STATUS), updateOrderStatus);

module.exports = router;