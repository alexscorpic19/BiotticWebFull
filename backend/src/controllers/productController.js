const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const fs = require('fs').promises; // Use promises version for better async handling
const path = require('path');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const filter = {};
  // If the request is not from an admin context, only show active products.
  if (req.query.admin !== 'true') {
    filter.active = true;
  }

  try {
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching products');
  }
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = asyncHandler(async (req, res) => {
  // Validate MongoDB ObjectId format
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error('Invalid product ID format');
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, active } = req.body;

  // Validation
  if (!name || !description || !price || !category) {
    res.status(400);
    throw new Error('Please provide all required fields: name, description, price, category');
  }

  // Validate price is a positive number
  if (isNaN(price) || price < 0) {
    res.status(400);
    throw new Error('Price must be a positive number');
  }

  // Validate stock is a non-negative integer
  if (stock !== undefined && (isNaN(stock) || stock < 0 || !Number.isInteger(Number(stock)))) {
    res.status(400);
    throw new Error('Stock must be a non-negative integer');
  }

  const imageUrls = req.files && req.files.images ? req.files.images.map(file => `/uploads/${file.filename}`) : [];
  const pdfs = req.files && req.files.pdf ? req.files.pdf.map(file => ({ name: file.originalname, path: `/uploads/${file.filename}` })) : [];

  const product = new Product({
    name: name.trim(),
    description: description.trim(),
    price: Number(price),
    images: imageUrls,
    pdfs: pdfs, // Store PDF objects
    category: category.trim(),
    stock: stock ? Number(stock) : 0,
    active: active === 'true' || active === true,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, active, deletedImages: deletedImagesJSON, deletedPdfs: deletedPdfsJSON } = req.body;

  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error('Invalid product ID format');
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Handle Image Updates
  let currentImages = product.images || [];
  if (deletedImagesJSON) {
    const deletedImages = JSON.parse(deletedImagesJSON);
    if (Array.isArray(deletedImages) && deletedImages.length > 0) {
      await Promise.all(deletedImages.map(async (imagePath) => {
        try {
          const fullPath = path.join(__dirname, '..', '..', imagePath);
          await fs.access(fullPath);
          await fs.unlink(fullPath);
        } catch (error) {
          console.warn(`Could not delete image ${imagePath}:`, error.message);
        }
      }));
      currentImages = currentImages.filter(img => !deletedImages.includes(img));
    }
  }
  if (req.files && req.files.images) {
    const newImagePaths = req.files.images.map(file => `/uploads/${file.filename}`);
    currentImages = [...currentImages, ...newImagePaths];
  }

  // Handle PDF Updates (with data migration)
  let currentPdfs = (product.pdfs || []).map(pdf => {
    if (typeof pdf === 'string') return { name: pdf.split('/').pop(), path: pdf };
    return pdf;
  });
  if (deletedPdfsJSON) {
    const deletedPaths = JSON.parse(deletedPdfsJSON);
    if (Array.isArray(deletedPaths) && deletedPaths.length > 0) {
      await Promise.all(deletedPaths.map(async (filePath) => {
        try {
          const fullPath = path.join(__dirname, '..', '..', filePath);
          await fs.access(fullPath);
          await fs.unlink(fullPath);
        } catch (error) {
          console.warn(`Could not delete PDF ${filePath}:`, error.message);
        }
      }));
      currentPdfs = currentPdfs.filter(p => p && !deletedPaths.includes(p.path));
    }
  }
  if (req.files && req.files.pdf) {
    const newPdfs = req.files.pdf.map(file => ({ name: file.originalname, path: `/uploads/${file.filename}` }));
    currentPdfs = [...currentPdfs, ...newPdfs];
  }


  // Build update object
  const updateData = {
    name: name || product.name,
    description: description || product.description,
    price: price || product.price,
    category: category || product.category,
    stock: stock || product.stock,
    active: active !== undefined ? (active === 'true' || active === true) : product.active,
    images: currentImages,
    pdfs: currentPdfs,
  };

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true, context: 'query' }
  );

  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
  // Validate MongoDB ObjectId format
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error('Invalid product ID format');
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    // Remove associated images from the file system (async)
    await Promise.all(product.images.map(async (img) => {
      try {
        const imagePath = path.join(__dirname, '..', '..', img.replace('/uploads/', 'uploads/'));
        await fs.access(imagePath); // Check if file exists
        await fs.unlink(imagePath); // Delete file
        console.log(`Deleted image: ${imagePath}`);
      } catch (error) {
        console.warn(`Could not delete image ${img}:`, error.message);
      }
    }));

    // Remove associated PDF from the file system (async)
    if (product.pdfs && product.pdfs.length > 0) {
      await Promise.all(product.pdfs.map(async (pdf) => {
        try {
          const pdfPath = path.join(__dirname, '..', '..', pdf.path);
          await fs.access(pdfPath); // Check if file exists
          await fs.unlink(pdfPath); // Delete file
          console.log(`Deleted PDF: ${pdfPath}`);
        } catch (error) {
          console.warn(`Could not delete PDF ${pdf.path}:`, error.message);
        }
      }));
    }

    await product.deleteOne(); // Use deleteOne instead of remove
    res.json({ message: 'Product removed successfully' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
exports.getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  
  if (!category || !category) {
    res.status(400);
    throw new Error('Category parameter is required');
  }

  try {
    const products = await Product.find({ 
      category: { $regex: category, $options: 'i' }, // Case-insensitive search
      active: true // Only return active products
    });
    console.log('Products found by category:', products);
    res.json(products);
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching products by category');
  }
});

// @desc    Search products
// @route   GET /api/products/search/:query
// @access  Public
exports.searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.params;
  
  if (!query || !query) {
    res.status(400);
    throw new Error('Search query is required');
  }

  try {
    const products = await Product.find({
      $and: [
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } }
          ]
        },
        { active: true } // Only return active products
      ]
    });
    console.log('Products found by search query:', products);
    res.json(products);
  } catch (error) {
    res.status(500);
    throw new Error('Error searching products');
  }
});

// @desc    Export all products
// @route   GET /api/products/export
// @access  Private (Admin)
exports.exportProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=products.json');
    res.send(JSON.stringify(products, null, 2));
  } catch (error) {
    console.error(error.message);
    res.status(500);
    throw new Error('Error exporting products');
  }
});