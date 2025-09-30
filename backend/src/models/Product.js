const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  pdfs: [{
    name: { type: String, required: true },
    path: { type: String, required: true },
  }], // New field for PDF paths
  active: { type: Boolean, required: true, default: true },
});

module.exports = mongoose.model('Product', productSchema);