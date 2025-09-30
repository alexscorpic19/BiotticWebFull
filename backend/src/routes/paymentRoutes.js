const express = require('express');
const router = express.Router();
const { initiatePayU, handlePayUConfirmation, handleWompiWebhook } = require('../controllers/paymentController');

// @route   POST /api/payments/payu
// @desc    Initiate PayU payment
// @access  Public
router.post('/payu', initiatePayU);

// @route   POST /api/payments/confirmation
// @desc    Handle PayU confirmation (webhook)
// @access  Public (PayU only)
router.post('/confirmation', handlePayUConfirmation);

// @route   POST /api/payments/wompi-webhook
// @desc    Handle Wompi confirmation (webhook)
// @access  Public (Wompi only)
router.post('/wompi-webhook', handleWompiWebhook);

module.exports = router;