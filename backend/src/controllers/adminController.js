const Contact = require('../../src/models/Contact');
const Order = require('../../src/models/Order');
const Product = require('../../src/models/Product');

// @desc    Get all contact messages
// @route   GET /api/admin/contacts
// @access  Private (Admin)
exports.getContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private (Admin)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('products.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate status against allowed enum values
    const allowedStatuses = ['pending', 'paid', 'failed', 'shipped', 'delivered'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    order.paymentStatus = status;
    await order.save();

    // Fetch the updated order with populated product details
    const updatedOrder = await Order.findById(id).populate('products.product');

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all products (for admin view)
// @route   GET /api/admin/products
// @access  Private (Admin)
exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ name: 1 });
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new product
// @route   POST /api/admin/products
// @access  Private (Admin)
exports.createProduct = async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      category,
      images,
    });

    const createdProduct = await newProduct.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res) => {
  const { name, description, price, stock, category, active } = req.body;
  
  // Get existing images from req.body.existingImagePaths
  let existingImagePaths = [];
  if (req.body.existingImagePaths) {
    existingImagePaths = Array.isArray(req.body.existingImagePaths) ? req.body.existingImagePaths : [req.body.existingImagePaths];
    existingImagePaths = existingImagePaths.filter(img => typeof img === 'string' && img !== '');
  }

  // Get new images from uploaded files
  const newUploadedImages = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

  // Combine existing and new images
  const imagesToSave = [...existingImagePaths, ...newUploadedImages];

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.stock = stock || product.stock;
      product.category = category || product.category;
      product.active = active !== undefined ? active : product.active;

      product.images = imagesToSave; // Assign the combined images

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error("Error updating product:", error.message); // More specific logging
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
