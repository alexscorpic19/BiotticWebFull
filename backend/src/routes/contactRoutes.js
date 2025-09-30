const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { createContact, getContacts, deleteContact, exportContacts, markAsRead } = require('../controllers/contactController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// @route   POST api/contact
// @desc    Create a contact
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone is required').not().isEmpty(),
    check('message', 'Message is required').not().isEmpty(),
  ],
  createContact
);

// @route   GET api/contact
// @desc    Get all contacts
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), getContacts);

// @route   DELETE api/contact/:id
// @desc    Delete a contact
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), deleteContact);

// @route   PUT api/contact/:id/read
// @desc    Mark a contact as read
// @access  Private (Admin)
router.put('/:id/read', protect, authorize('admin'), markAsRead);

// @route   GET api/contact/export
// @desc    Export all contacts
// @access  Private (Admin)
router.get('/export', protect, authorize('admin'), exportContacts);

module.exports = router;