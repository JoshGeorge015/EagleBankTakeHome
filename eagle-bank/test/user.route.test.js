// tests/User.routes.test.js
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import userRoutes from '../routes/userRoutes.js';

const app = express();
app.use(express.json());
app.use('/v1/users', userRoutes);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyROUTES' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Routes', () => {
  it('POST /v1/users should create a user', async () => {
    const res = await request(app)
      .post('/v1/users')
      .send({ email: 'test@example.com', password: 'secure123', name: 'Test User' });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('POST /v1/users should fail with missing fields', async () => {
    const res = await request(app).post('/v1/users').send({ name: 'Missing Email' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeUndefined();
  });
});