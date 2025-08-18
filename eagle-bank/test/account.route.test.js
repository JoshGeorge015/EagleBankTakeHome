// tests/User.routes.test.js
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import accountRoutes from '../routes/accountRoutes.js';
import User from '../models/User.js';
import jsonwebtoken from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/v1/accounts', accountRoutes);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyROUTES' });
   const user = new User({ email: 'test@example.com', password: 'secure123', name: 'Test User' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Account Routes', () => {
  it('POST /v1/accounts should create an account', async () => {
    const user = new User({ email: 'test@example.com', password: 'secure123', name: 'Test User' });
    await user.save();

    const token = jsonwebtoken.sign({ userId: user._id }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
    const res = await request(app)
      .post('/v1/accounts')
      .send({ userId: user._id, accountType: 'savings', accountStatus: 'active', AccountNumber: 12345678, SortCode: 123456, balance: 1000 }).set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('Account created successfully');
    expect(res.body.accountObj.accountType).toBe('savings'); // deosnt retrieve
  });

  it('POST /v1/accounts should fail with missing fields', async () => {
    const res = await request(app).post('/v1/accounts').send({ name: 'Missing Email' });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeUndefined();
  });
});
