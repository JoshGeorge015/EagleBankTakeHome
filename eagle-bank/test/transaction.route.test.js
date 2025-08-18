// tests/User.routes.test.js
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import transactionRoutes from '../routes/userRoutes.js';

const app = express();
app.use(express.json());
app.use('/v1/transactions', transactionRoutes);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyROUTES' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Transaction Routes', () => {
  it('POST /v1/transactions should create a transaction', async () => {
    const res = await request(app)
      .post('/v1/accounts/random12312312/transactions/')
      .send({ userID: 'user123', transactionType: 'deposit', AccountNumber: '12345678', SortCode: '123456', amount: 500 });

    expect(res.statusCode).toBe(201);
    expect(res.body.transactionObj.AccountNumber).toBe('12345678');
  });

  it('POST /v1/transactions should fail with missing fields', async () => {
    const res = await request(app).post('/v1/accounts/random12312312/transactions/').send({ transactionType: 'deposit' });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBeUndefined();
  });
});