const mongoose = require('mongoose');
const productItemSchema = require('./ProductItem');
const customerInfoSchema = require('./CustomerInfo');

const orderSchema = new mongoose.Schema({
  products: [productItemSchema],
  total: {
    type: Number,
    required: true
  },
  customer: customerInfoSchema,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'Completed', 'Cancelled'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Completed', 'Failed'],
    default: 'Pending'
  },
  paymentReference: {
    type: String
  },
  trackingNumber: {
    type: String
  },
  shippingCompany: {
    type: String
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
