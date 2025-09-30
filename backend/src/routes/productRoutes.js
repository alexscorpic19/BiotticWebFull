const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  exportProducts,
  getProductsByCategory,
  searchProducts,
} = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig'); // Import multer upload configuration

// Public routes
router.route('/').get(getProducts);
router.route('/export').get(protect, authorize('admin'), exportProducts);
router.route('/category/:category').get(getProductsByCategory);
router.route('/search/:query').get(searchProducts);
router.route('/:id').get(getProductById);

// Admin routes
// Apply multer middleware to handle image uploads for product creation and update
router.route('/').post(protect, authorize('admin'), upload.fields([{ name: 'images', maxCount: 10 }, { name: 'pdf', maxCount: 10 }]), createProduct);
router.route('/:id').put(protect, authorize('admin'), upload.fields([{ name: 'images', maxCount: 10 }, { name: 'pdf', maxCount: 10 }]), updateProduct);
router.route('/:id').delete(protect, authorize('admin'), deleteProduct);

// Export products route
// router.route('/export').get(protect, authorize('admin'), exportProducts);

module.exports = router;