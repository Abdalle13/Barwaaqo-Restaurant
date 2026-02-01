const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authoriz');
const { PERMISSIONS } = require('../seeds/constants');

const { 
  getCategories,
  getCategoryById,
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/categoryController');

// Dhammaan routes-ka waxay u baahan yihiin in qofku Login yahay (protect)
router.get('/', protect, authorize(PERMISSIONS.VIEW_CATEGORIES), getCategories);
router.get('/:id', protect, authorize(PERMISSIONS.VIEW_CATEGORIES), getCategoryById);

router.post('/', protect, authorize(PERMISSIONS.CREATE_CATEGORY), createCategory);
router.put('/:id', protect, authorize(PERMISSIONS.UPDATE_CATEGORY), updateCategory);
router.delete('/:id', protect, authorize(PERMISSIONS.DELETE_CATEGORY), deleteCategory);

module.exports = router;