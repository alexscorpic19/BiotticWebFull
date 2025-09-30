require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const connectDB = require('./src/config/database');

connectDB();

const products = [
  {
    name: 'Cámara de Seguridad IP Biottic',
    description: 'Cámara IP de alta definición con visión nocturna y detección de movimiento. Ideal para monitoreo de hogar y oficina.',
    price: 150000,
    stock: 50,
    category: 'Cámaras',
    images: ['/uploads/camera1.jpg', '/uploads/camera2.jpg'],
    active: true,
  },
  {
    name: 'Sensor de Movimiento Inalámbrico Biottic',
    description: 'Sensor PIR inalámbrico para sistemas de alarma. Fácil instalación y alta sensibilidad.',
    price: 300000,
    stock: 100,
    category: 'Sensores',
    images: ['/uploads/sensor1.jpg'],
    active: true,
  },
  {
    name: 'Alarma Inteligente Biottic Home',
    description: 'Sistema de alarma completo con panel de control, sensores y sirena. Controlable desde tu smartphone.',
    price: 540000,
    stock: 30,
    category: 'Alarmas',
    images: ['/uploads/alarm1.jpg', '/uploads/alarm2.jpg'],
    active: true,
  },
  {
    name: 'Kit de Videoportero Biottic Pro',
    description: 'Videoportero con pantalla a color, visión nocturna y apertura remota de puerta. Seguridad y comodidad.',
    price: 360000,
    stock: 20,
    category: 'Videoporteros',
    images: ['/uploads/videoportero1.jpg'],
    active: true,
  },
  {
    name: 'Cerradura Inteligente Biottic Secure',
    description: 'Cerradura electrónica con múltiples métodos de acceso: huella, código, tarjeta y app móvil.',
    price: 420000,
    stock: 40,
    category: 'Cerraduras',
    images: ['/uploads/cerradura1.jpg'],
    active: true,
  },
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}