const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middlewares/authMiddleware'); // Assuming these exist

router.route('/')
  .get(getAllCategories) // Public access to get all categories
  .post(protect, authorize('admin'), createCategory); // Admin only to create category

router.route('/:id')
  .put(protect, authorize('admin'), updateCategory) // Admin only to update category
  .delete(protect, authorize('admin'), deleteCategory); // Admin only to delete category

module.exports = router;