const express = require('express');
const router = express.Router();
const { createPermission, getPermissions } = require('../controllers/permissionController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authoriz');
const { PERMISSIONS } = require('../seeds/constants');

// Kaliya Admin-ka ayaa maamuli kara Permissions-ka
router.post('/', protect, authorize(PERMISSIONS.MANAGE_ROLES), createPermission);
router.get('/', protect, authorize(PERMISSIONS.MANAGE_ROLES), getPermissions);

module.exports = router;