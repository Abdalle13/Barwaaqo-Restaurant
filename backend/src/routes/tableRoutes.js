const express = require('express');
const router = express.Router();
const {
  getTables,
  createTable,
  updateTable,
  deleteTable,
} = require('../controllers/tableController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authoriz');
const { PERMISSIONS } = require('../seeds/constants');

// Anyone can view available tables for reservation
router.get('/', getTables);

// Admin-only management
router.post('/', protect, authorize(PERMISSIONS.MANAGE_TABLES), createTable);
router.put('/:id', protect, authorize(PERMISSIONS.MANAGE_TABLES), updateTable);
router.delete('/:id', protect, authorize(PERMISSIONS.MANAGE_TABLES), deleteTable);

module.exports = router;
