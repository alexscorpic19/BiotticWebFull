const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStatusById,
  deleteOrder,
  exportOrders,
  getOrderByWompiTransactionId,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// PUBLIC ROUTE for order status
router.route('/status/:id').get(getOrderStatusById);
router.route('/export').get(protect, authorize('admin'), exportOrders);
router.route('/').post(addOrderItems).get(protect, authorize('admin'), getOrders);
router.route('/:id').get(protect, authorize('admin'), getOrderById);
router.route('/wompi-transaction/:wompiTransactionId').get(getOrderByWompiTransactionId);
router.route('/:id/status').put(protect, authorize('admin'), updateOrderStatus);
router.route('/:id').delete(protect, authorize('admin'), deleteOrder);

module.exports = router;
