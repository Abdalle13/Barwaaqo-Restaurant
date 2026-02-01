const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authoriz');
const { PERMISSIONS } = require('../seeds/constants');
const upload = require('../utils/fileUpload');

const { 
    getFoods, 
    getFoodById,
  createFood, 
  updateFood, 
  deleteFood 
} = require('../controllers/foodController');


// 1. GET All Foods (All Users)
router.get('/', protect, authorize(PERMISSIONS.VIEW_FOOD), getFoods);
// 2. GET Single Food (All Users)
router.get('/:id', protect, authorize(PERMISSIONS.VIEW_FOOD), getFoodById);
// 2. Create food (Admin Only)
router.post('/', protect, authorize(PERMISSIONS.CREATE_FOOD), upload.single('image'), createFood);
// 3. Update Food (Admin Only)
router.put('/:id', protect, authorize(PERMISSIONS.UPDATE_FOOD), upload.single('image'), updateFood)
// 4. Delete Food (Admin Only)
router.delete('/:id', protect, authorize(PERMISSIONS.DELETE_FOOD), deleteFood);

module.exports = router;