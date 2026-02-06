const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authoriz');
const { PERMISSIONS } = require('../seeds/constants');
const upload = require('../utils/fileUpload');

const {
  getAllUsers,
  getUserById,
  toggleUserStatus,
  updateUserProfile
} = require('../controllers/userController');


router.put(
  '/profile',
  protect,
  authorize(PERMISSIONS.UPDATE_PROFILE),
  upload.single('image'), 
  updateUserProfile
);

// GET All Users (Admin)
router.get(
  '/',
  protect,
  authorize(PERMISSIONS.VIEW_USERS),
  getAllUsers
);

// GET Single User (Admin)
router.get(
  '/:id',
  protect,
  authorize(PERMISSIONS.VIEW_USERS),
  getUserById
);

router.put(
  '/toggle-status/:id',
  protect,
  authorize(PERMISSIONS.DELETE_USER), 
  toggleUserStatus
);
module.exports = router;
