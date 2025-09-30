const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { 
  getContactMessages, 
  getOrders, 
  updateOrderStatus, 
  getAdminProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/adminController');
const { 
  createProjectPost, 
  updateProjectPost, 
  deleteProjectPost 
} = require('../controllers/projectPostController');

// Protect all admin routes
router.use(protect, authorize('admin'));

// Contact Messages
router.get('/contacts', getContactMessages);

// Orders
router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Products
router.get('/products', getAdminProducts);
router.post('/products', upload.array('images', 10), createProduct);
router.put('/products/:id', upload.array('images', 10), updateProduct);
router.delete('/products/:id', deleteProduct);

// Project Posts
router.post('/project-posts', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'attachments', maxCount: 10 }
]), createProjectPost);

router.put('/project-posts/:id', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'attachments', maxCount: 10 }
]), updateProjectPost);

router.delete('/project-posts/:id', deleteProjectPost);

module.exports = router;
