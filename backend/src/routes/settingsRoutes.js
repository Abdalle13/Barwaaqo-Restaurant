const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authoriz');
const { PERMISSIONS } = require('../seeds/constants');

// Public can read general info (currency, hours, tax, delivery fee)
router.get('/', getSettings);

// Admin can update configuration
router.put('/', protect, authorize(PERMISSIONS.MANAGE_SETTINGS), updateSettings);

module.exports = router;
