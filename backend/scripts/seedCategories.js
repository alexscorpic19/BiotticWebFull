const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../src/models/Category'); // Adjust path if necessary

dotenv.config(); // Load environment variables from parent directory

const categories = [
  { name: 'Sensores' },
  { name: 'Cámaras' },
  { name: 'Alarmas' },
  { name: 'Videoporteros' },
  { name: 'Cerraduras Inteligentes' },
  { name: 'Domótica' },
  { name: 'Biobot' },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    await Category.deleteMany(); // Clear existing categories to prevent duplicates on re-run
    console.log('Existing categories cleared.');

    await Category.insertMany(categories);
    console.log('Categories seeded successfully!');

    process.exit();
  } catch (error) {
    console.error(`Error seeding categories: ${error.message}`);
    process.exit(1);
  }
};

seedCategories();
