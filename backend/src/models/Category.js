const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Category', categorySchema);