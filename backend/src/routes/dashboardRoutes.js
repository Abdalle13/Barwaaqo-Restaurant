const express = require('express');
const router = express.Router();
const { getAdminDashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authoriz');
const { PERMISSIONS } = require('../seeds/constants');

// Route: GET /api/dashboard/stats
router.get('/stats', protect, authorize(PERMISSIONS.VIEW_ALL_ORDERS), getAdminDashboardStats);

module.exports = router;