require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./src/models/User');
const connectDB = require('./src/config/database');

connectDB();

const createAdminUser = async () => {
  try {
    const email = 'admin@example.com';
    const password = 'password123'; // Change this to a strong password in production

    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('Admin user already exists!');
      process.exit();
    }

    const adminUser = await User.create({
      name: 'Admin User',
      email,
      password,
      role: 'admin',
    });

    console.log(`Admin user created: ${adminUser.email}`);
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

createAdminUser();
