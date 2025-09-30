const mongoose = require('mongoose');

const ProjectPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'El contenido es obligatorio'],
  },
  mainImage: {
    type: String,
    required: false,
  },
  images: [String],
  attachments: [{
    name: { type: String, required: true },
    path: { type: String, required: true },
  }],
  youtubeLink: {
    type: String,
    required: false,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ProjectPost', ProjectPostSchema);