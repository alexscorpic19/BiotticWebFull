const request = require('supertest');
const app = require('../src/index');
const Contact = require('../src/models/Contact');

describe('Contact Routes', () => {
  it('should create a new contact', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        company: 'Test Company',
        message: 'This is a test message.',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Test User');

    const contact = await Contact.findById(res.body._id);
    expect(contact).not.toBeNull();
  });

  it('should return a 400 error if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        email: 'test@example.com',
        phone: '1234567890',
        message: 'This is a test message.',
      });

    expect(res.statusCode).toEqual(400);
  });
});