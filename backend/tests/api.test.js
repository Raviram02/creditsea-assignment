const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('API Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect('mongodb://localhost:27017/creditsea_test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('GET /health should return 200', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('POST /api/upload without file should return 400', async () => {
    const response = await request(app).post('/api/upload');
    expect(response.statusCode).toBe(400);
  });

  test('GET /api/reports should return reports array', async () => {
    const response = await request(app).get('/api/reports');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});