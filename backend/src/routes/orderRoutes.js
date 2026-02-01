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
  updateOrderStatus
} = require('../controllers/orderController');

// 1. Customer: Meesha uu dalabka ka dhibayo & Meesha uu ku arkayo kuwiisa gaarka ah
router.post('/', protect, authorize(PERMISSIONS.CREATE_ORDER), createOrder);
router.get('/myorders', protect, authorize(PERMISSIONS.VIEW_MY_ORDERS), getMyOrders);

// 2. Admin: Meesha uu ku arkayo dhamaan dalabaadka & Meesha uu status-ka ka beddelayo
router.get('/', protect, authorize(PERMISSIONS.VIEW_ALL_ORDERS), getAllOrders);
router.get('/:id', protect, getOrderById); // Get By ID
router.put('/:id/status', protect, authorize(PERMISSIONS.UPDATE_ORDER_STATUS), updateOrderStatus);

module.exports = router;