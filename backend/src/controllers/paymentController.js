const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const CustomerInfo = require('../models/CustomerInfo');

// Helper function to generate PayU signature
const generateSignature = (merchantId, apiLogin, referenceCode, amount, currency, state, test) => {
  const signatureText = `${apiLogin}~${merchantId}~${referenceCode}~${amount}~${currency}~${state}`;
  return crypto.createHash('md5').update(signatureText).digest('hex');
};

// @desc    Initiate PayU payment
// @route   POST /api/payments/payu
// @access  Public
exports.initiatePayU = async (req, res) => {
  const { cartItems, customerInfo } = req.body;

  try {
    // Calculate total amount
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Create a new order in pending state
    const order = new Order({
      products: cartItems.map(item => ({ product: item._id, quantity: item.quantity })),
      total: totalAmount,
      customer: customerInfo,
      paymentStatus: 'pending',
    });

    await order.save();

    const referenceCode = order._id.toString(); // Use order ID as reference
    const currency = 'COP'; // Colombian Pesos
    const description = `Order #${referenceCode}`;
    const buyerEmail = customerInfo.email;
    const testMode = process.env.PAYU_TEST === 'true' ? '1' : '0';

    const signature = generateSignature(
      process.env.PAYU_MERCHANT_ID,
      process.env.PAYU_API_KEY,
      referenceCode,
      totalAmount.toFixed(2),
      currency,
      'pending',
      testMode
    );

    const payuForm = {
      merchantId: process.env.PAYU_MERCHANT_ID,
      accountId: process.env.PAYU_ACCOUNT_ID,
      description: description,
      referenceCode: referenceCode,
      amount: totalAmount.toFixed(2),
      tax: '0',
      taxReturnBase: '0',
      currency: currency,
      signature: signature,
      buyerEmail: buyerEmail,
      responseUrl: process.env.PAYU_CONFIRMATION_URL, // URL where PayU sends confirmation
      confirmationUrl: process.env.PAYU_CONFIRMATION_URL, // URL for webhook
      test: testMode,
      // Additional fields as needed by PayU
      shippingAddress: customerInfo.address,
      telephone: customerInfo.phone,
      buyerFullName: customerInfo.name,
    };

    res.json({ payuUrl: process.env.PAYU_URL, payuForm });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Handle PayU confirmation (webhook)
// @route   POST /api/payments/confirmation
// @access  Public (PayU only)
exports.handlePayUConfirmation = async (req, res) => {
  const { 
    signature,
    merchant_id,
    reference_code,
    state_pol,
    value,
    currency,
    response_code_pol,
    transaction_id,
    sign,
    // Add other relevant fields from PayU confirmation
  } = req.body;

  try {
    // Verify signature
    const expectedSignature = generateSignature(
      merchant_id,
      process.env.PAYU_API_KEY,
      reference_code,
      value,
      currency,
      state_pol,
      process.env.PAYU_TEST === 'true' ? '1' : '0'
    );

    if (expectedSignature !== sign) {
      console.log('Invalid PayU signature');
      return res.status(400).send('Invalid signature');
    }

    const order = await Order.findById(reference_code);

    if (!order) {
      console.log('Order not found');
      return res.status(404).send('Order not found');
    }

    let newPaymentStatus;
    switch (state_pol) {
      case '4': // Approved
        newPaymentStatus = 'paid';
        break;
      case '6': // Declined
        newPaymentStatus = 'failed';
        break;
      case '5': // Expired
        newPaymentStatus = 'failed';
        break;
      case '7': // Pending
        newPaymentStatus = 'pending';
        break;
      default:
        newPaymentStatus = 'pending';
    }

    order.paymentStatus = newPaymentStatus;
    order.payuReference = transaction_id; // Store PayU transaction ID
    await order.save();

    // You might want to send an email to the customer here
    // based on the payment status

    res.status(200).send('OK'); // Important: PayU expects a 200 OK response

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Handle Wompi webhook
// @route   POST /api/payments/wompi-webhook
// @access  Public (Wompi only)
exports.handleWompiWebhook = async (req, res) => {
  console.log('--- Wompi Webhook Received ---');

  let eventBody;
  try {
    eventBody = JSON.parse(req.body.toString());
  } catch (parseError) {
    console.error('Error parsing Wompi webhook body:', parseError);
    return res.status(400).send('Invalid JSON body');
  }

  console.log('Parsed Webhook Body:', JSON.stringify(eventBody, null, 2));

  try {
    const { data, signature, timestamp } = eventBody;
    const wompiEventsSecret = process.env.WOMPI_EVENTS_SECRET;

    if (!data || !signature || !signature.properties || !timestamp || !wompiEventsSecret) {
      console.log('Webhook request missing required fields');
      return res.status(400).send('Invalid webhook structure');
    }

    // Dynamically build the concatenated string for signature verification
    const properties = signature.properties;
    let concatenatedString = '';
    
    // Access nested properties like 'transaction.id'
    const getNestedValue = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

    for (const prop of properties) {
      const value = getNestedValue(data, prop);
      if (value === null || value === undefined) {
        console.error(`Property ${prop} not found in webhook data`);
        return res.status(400).send('Invalid signature property');
      }
      concatenatedString += value;
    }
    
    concatenatedString += timestamp;
    concatenatedString += wompiEventsSecret;

    console.log('String for Signature (our calculation):', concatenatedString);

    // Calculate the signature
    const calculatedSignature = crypto.createHash('sha256').update(concatenatedString).digest('hex');
    console.log('Calculated Signature (our calculation):', calculatedSignature);
    console.log('Received Signature (from Wompi):', signature.checksum);

    // Compare signatures
    if (calculatedSignature !== signature.checksum) {
      console.log('SIGNATURE MISMATCH! Invalid Wompi webhook signature.');
      // Note: In a real production environment, you might want to be more careful here.
      // A mismatch could be a security issue, but during development/testing, it's often a configuration error.
      // For now, we will return an error.
      return res.status(400).send('Invalid signature');
    }
    
    console.log('Signature validation successful.');

    // --- Signature is valid, proceed with business logic ---
    const { reference, status, id: wompiTransactionId } = data.transaction;
    const orderId = reference.split('-')[0];
    console.log(`Parsed Order ID: ${orderId}`);

    if (status === 'APPROVED') {
      console.log(`Transaction APPROVED. Attempting to update order ${orderId}...`);
      const order = await Order.findById(orderId);

      if (order) {
        console.log(`Order ${orderId} found. Current payment status: ${order.paymentStatus}`);
        if (order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          order.paymentReference = wompiTransactionId;
          await order.save();
          console.log(`Order ${orderId} payment status successfully updated to 'paid'.`);
        } else {
          console.log(`Order ${orderId} was already marked as 'paid'. No update needed.`);
        }
      } else {
        console.log(`Webhook received for non-existent order reference: ${reference}`);
      }
    } else {
      console.log(`Webhook received for order ${orderId} with status ${status}. Attempting to update...`);
      const order = await Order.findById(orderId);
      if (order) {
        // Update status for declined, voided, etc.
        order.paymentStatus = status.toLowerCase();
        order.paymentReference = wompiTransactionId;
        await order.save();
        console.log(`Order ${orderId} payment status updated to '${status.toLowerCase()}'.`);
      } else {
         console.log(`Webhook received for non-existent order reference: ${reference}`);
      }
    }

    res.status(200).json({ message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('Error handling Wompi webhook:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
