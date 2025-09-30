const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

// @desc    Get all contacts
// @route   GET /api/contact
// @access  Private (Admin)
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a contact
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Contact removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Mark a contact as read
// @route   PUT /api/contact/:id/read
// @access  Private (Admin)
exports.markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }

    contact.read = true;

    const updatedContact = await contact.save();

    res.json(updatedContact);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Create a contact
// @route   POST /api/contact
// @access  Public
exports.createContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, company, message } = req.body;

  try {
    const newContact = new Contact({
      name,
      email,
      phone,
      company,
      message
    });

    const contact = await newContact.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: 'New Contact Form Submission',
      html: `<p>You have a new contact form submission:</p>
             <ul>
               <li>Name: ${name}</li>
               <li>Email: ${email}</li>
               <li>Phone: ${phone}</li>
               <li>Company: ${company}</li>
               <li>Message: ${message}</li>
             </ul>`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json(contact);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Export all contacts
// @route   GET /api/contact/export
// @access  Private (Admin)
exports.exportContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.json');
    res.send(JSON.stringify(contacts, null, 2));
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};