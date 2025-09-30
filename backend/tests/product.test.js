const request = require('supertest');
const { app } = require('./setup'); // Import app from setup.js
const Product = require('../src/models/Product');
const mongoose = require('mongoose');

describe('Product Routes', () => {
  let productId;

  beforeEach(async () => {
    // Create a product for testing getProductById
    const product = new Product({
      name: 'Test Product',
      description: 'Description for test product',
      price: 100,
      category: 'Electronics',
      stock: 10,
      active: true,
    });
    const createdProduct = await product.save();
    console.log('Created product in beforeEach:', createdProduct);
    const foundProducts = await Product.find({});
    console.log('Products in DB after creation:', foundProducts);
    productId = createdProduct._id;
  });

  it('should fetch all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should fetch a single product by ID', async () => {
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', productId.toString());
    expect(res.body.name).toBe('Test Product');
  });

  it('should return 404 if product not found', async () => {
    const nonExistentId = '60c72b2f9b1e8b001c8e4d1a'; // A valid but non-existent ObjectId
    const res = await request(app).get(`/api/products/${nonExistentId}`);
    expect(res.statusCode).toEqual(404);
  });

  it('should return 400 for invalid product ID format', async () => {
    const invalidId = 'invalidId';
    const res = await request(app).get(`/api/products/${invalidId}`);
    expect(res.statusCode).toEqual(400);
  });

  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'New Product',
        description: 'Description of new product',
        price: 200,
        category: 'Books',
        stock: 50,
        active: true,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('New Product');

    const product = await Product.findById(res.body._id);
    expect(product).not.toBeNull();
  });

  it('should fetch products by category', async () => {
    const res = await request(app).get('/api/products/category/Electronics');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].category).toBe('Electronics');
  });

  it('should return 400 if category is missing for getProductsByCategory', async () => {
    const res = await request(app).get('/api/products/category/');
    expect(res.statusCode).toEqual(400); // Express router will return 404 for missing param
  });

  it('should search products by query', async () => {
    const res = await request(app).get('/api/products/search/Test');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toContain('Test');
  });

  it('should return 400 if search query is missing', async () => {
    const res = await request(app).get('/api/products/search/');
    expect(res.statusCode).toEqual(400); // Express router will return 404 for missing param
  });
});