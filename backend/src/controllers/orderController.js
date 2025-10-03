const { URL, URLSearchParams } = require('url');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order and generate Wompi payment URL
// @route   POST /api/orders
// @access  Public
const addOrderItems = async (req, res) => {
  try {
    const { cartItems, customerInfo } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'No cart items' });
    }

    if (!customerInfo) {
      return res.status(400).json({ message: 'Customer information is required' });
    }

    const orderProducts = cartItems.map(item => ({
      product: item._id,
      quantity: item.quantity,
    }));

    let calculatedTotal = 0;
    for (const item of cartItems) {
      const product = await Product.findById(item._id);
      if (!product) {
        return res.status(404).json({ message: `Product not found with ID: ${item._id}` });
      }
      calculatedTotal += product.price * item.quantity;
    }

    const order = new Order({
      products: orderProducts,
      customer: customerInfo,
      total: calculatedTotal,
      paymentStatus: 'pending',
      orderStatus: 'Pending',
    });

    const createdOrder = await order.save();

    // --- Wompi URL Generation ---
    const wompiPublicKey = process.env.WOMPI_PUBLIC_KEY;
    const wompiIntegritySecret = process.env.WOMPI_INTEGRITY_SECRET;
    const reference = `${createdOrder._id}-${Date.now()}`;
    const amountInCents = Math.round(createdOrder.total * 100);
    const currency = 'COP';

    console.log('--- WOMPI DATA ---');
    console.log('Reference:', reference);
    console.log('Amount in cents:', amountInCents);
    console.log('Currency:', currency);
    console.log('Integrity Secret:', wompiIntegritySecret);

    console.log('--- DEBUG: Generating redirect URL for Order ID:', createdOrder._id.toString(), '---');

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrlObject = new URL(`${frontendUrl}/confirmation`);
    redirectUrlObject.searchParams.set('orderId', createdOrder._id.toString());
    const redirectUrl = redirectUrlObject.toString();

    const concatenation = `${reference}${amountInCents}${currency}${wompiIntegritySecret}`;
    const signature = crypto.createHash('sha256').update(concatenation).digest('hex');

    const wompiUrl = `https://checkout.wompi.co/p/?public-key=${wompiPublicKey}&currency=${currency}&amount-in-cents=${amountInCents}&reference=${reference}&redirect-url=${encodeURIComponent(redirectUrl)}&signature:integrity=${signature}`;

    res.status(201).json({ wompiUrl, orderId: createdOrder._id.toString() });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Handle Wompi Webhook
// @route   POST /api/orders/wompi-webhook
// @access  Public
const wompiWebhook = async (req, res) => {
  try {
    const { data, event, signature } = req.body;
    console.log('--- WOMPI WEBHOOK RECEIVED ---');
    console.log('Event:', event);
    console.log('Data:', JSON.stringify(data, null, 2));

    // Basic validation
    if (!data || !data.transaction) {
      console.log('Webhook ignored: No transaction data.');
      return res.status(400).json({ message: 'Invalid webhook payload' });
    }

    const { reference, status, id: wompiTransactionId, amount_in_cents, customer_email } = data.transaction;

    // Extract our internal order ID from the reference
    const orderId = reference.split('-')[0];

    const order = await Order.findById(orderId);

    if (!order) {
      console.log(`Webhook ignored: Order not found with ID: ${orderId}`);
      // Respond 200 so Wompi doesn't retry
      return res.status(200).json({ message: 'Order not found, but acknowledged.' });
    }

    // Check if the order is already processed
    if (order.paymentStatus === 'approved') {
        console.log(`Webhook ignored: Order ${orderId} is already approved.`);
        return res.status(200).json({ message: 'Order already processed.' });
    }

    // Update order based on status
    if (status === 'APPROVED') {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentStatus = 'approved';
      order.paymentResult = {
        id: wompiTransactionId,
        status: status,
        email_address: customer_email,
        amount: amount_in_cents / 100,
      };
      order.paymentReference = wompiTransactionId;

      console.log(`Order ${orderId} updated to APPROVED.`);
      
      // You might want to decrease product stock here
      // for (const item of order.products) {
      //   await Product.findByIdAndUpdate(item.product, {
      //     $inc: { countInStock: -item.quantity },
      //   });
      // }

    } else if (status === 'DECLINED' || status === 'VOIDED' || status === 'ERROR') {
      order.paymentStatus = 'failed';
      console.log(`Order ${orderId} updated to FAILED.`);
    }

    await order.save();

    res.status(200).json({ message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('Error processing Wompi webhook:', error);
    res.status(500).json({ message: 'Server Error processing webhook' });
  }
};


// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get public order status by ID
// @route   GET /api/orders/status/:id
// @access  Public
const getOrderStatusById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).select('orderStatus paymentStatus createdAt customer.name trackingNumber shippingCompany total products').populate('products.product');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error fetching order status:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      const { orderStatus, trackingNumber, shippingCompany } = req.body;

      if (orderStatus) {
        order.orderStatus = orderStatus;
      }

      if (trackingNumber !== undefined) {
        order.trackingNumber = trackingNumber;
      }

      if (shippingCompany !== undefined) {
        order.shippingCompany = shippingCompany;
      }

      await order.save();

      // Re-fetch the order to populate product details before sending back
      const populatedOrder = await Order.findById(req.params.id).populate('products.product');

      res.json(populatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: 'Order removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Export all orders
// @route   GET /api/orders/export
// @access  Private (Admin)
const exportOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).lean();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.json');
    res.send(JSON.stringify(orders, null, 2));
  } catch (error) {
    res.status(500).send('Server Error');
  }
};


const getOrderByWompiTransactionId = async (req, res) => {
  try {
    const { wompiTransactionId } = req.params;
    console.log('getOrderByWompiTransactionId called with wompiTransactionId:', wompiTransactionId);
    const order = await Order.findOne({ paymentReference: wompiTransactionId }).populate('products.product');

    if (order) {
      console.log('Order found by Wompi transaction ID:', order._id);
      res.json(order);
    } else {
      console.log('Order not found by Wompi transaction ID:', wompiTransactionId);
      res.status(404).json({ message: 'Order not found with that Wompi transaction ID' });
    }
  } catch (error) {
    console.error('Error fetching order by Wompi transaction ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  addOrderItems,
  getOrders,
  getOrderById,
  getOrderStatusById,
  updateOrderStatus,
  deleteOrder,
  exportOrders,
  getOrderByWompiTransactionId,
  wompiWebhook,
};

