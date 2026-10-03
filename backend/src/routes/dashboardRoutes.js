const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getRevenueChartData,
  getTopSellingFoods,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authoriz');
const { PERMISSIONS } = require('../seeds/constants');

// Admin Analytics Endpoints
router.get('/stats', protect, authorize(PERMISSIONS.VIEW_DASHBOARD), getAdminDashboardStats);
router.get('/revenue-chart', protect, authorize(PERMISSIONS.VIEW_DASHBOARD), getRevenueChartData);
router.get('/top-foods', protect, authorize(PERMISSIONS.VIEW_DASHBOARD), getTopSellingFoods);

module.exports = router;