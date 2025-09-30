const express = require('express');
const router = express.Router();
const {
  getProjectPosts,
  getProjectPostById,
} = require('../controllers/projectPostController');

// Rutas Públicas
router.route('/').get(getProjectPosts);
router.route('/:id').get(getProjectPostById);

module.exports = router;