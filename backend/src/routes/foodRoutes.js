const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authoriz');
const { PERMISSIONS } = require('../seeds/constants');
const upload = require('../utils/fileUpload');

const {
  getFoods,
  getPopularFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} = require('../controllers/foodController');

// Public routes for visitors & diners
router.get('/', getFoods);
router.get('/popular', getPopularFoods);
router.get('/:id', getFoodById);

// Admin-only management routes
router.post('/', protect, authorize(PERMISSIONS.CREATE_FOOD), upload.single('image'), createFood);
router.put('/:id', protect, authorize(PERMISSIONS.UPDATE_FOOD), upload.single('image'), updateFood);
router.delete('/:id', protect, authorize(PERMISSIONS.DELETE_FOOD), deleteFood);

module.exports = router;