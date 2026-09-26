const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authoriz');
const { PERMISSIONS } = require('../seeds/constants');

const {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController');

// All staff routes require MANAGE_STAFF permission
router.use(protect);
router.use(authorize(PERMISSIONS.MANAGE_STAFF));

router.route('/')
  .get(getAllStaff)
  .post(createStaff);

router.route('/:id')
  .put(updateStaff)
  .delete(deleteStaff);

module.exports = router;
