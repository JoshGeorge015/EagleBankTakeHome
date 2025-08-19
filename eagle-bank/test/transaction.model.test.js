import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Transaction from '../models/Transaction.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMODEL' });
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) await mongoServer.stop();
});

describe('Transaction Model', () => {
  it('should create and save a transaction successfully', async () => {
    const transactionData = {
      userId: 'user123',
      transactionType: 'deposit',
      AccountNumber: 12345678,
      SortCode: 123456,
      amount: 500
    };

    const transaction = new Transaction(transactionData);
    const savedTransaction = await transaction.save();

    expect(savedTransaction._id).toBeDefined();
    expect(savedTransaction.transactionType).toBe(transactionData.transactionType);
    expect(savedTransaction.amount).toBe(transactionData.amount);
  });

  it('should fail when required fields are missing', async () => {
    const transaction = new Transaction({ transactionType: 'withdrawal' }); // missing userId, AccountNumber, etc.
    let err;
    try {
      await transaction.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.userId).toBeDefined();
    expect(err.errors.AccountNumber).toBeDefined();
    expect(err.errors.amount).toBeDefined();
  });

  it('should find a transaction by AccountNumber and SortCode', async () => {
    const transactionData = {
      userId: 'user123',
      transactionType: 'deposit',
      AccountNumber: 12345678,
      SortCode: 123456,
      amount: 500
    };

    await Transaction.create(transactionData);
    const found = await Transaction.findOne({ AccountNumber: 12345678, SortCode: 123456 });

    expect(found).not.toBeNull();
    expect(found.userId).toBe(transactionData.userId);
  });

  it('should update a transaction amount using findByIdAndUpdate', async () => {
    const transaction = await Transaction.create({
      userId: 'user123',
      transactionType: 'deposit',
      AccountNumber: 12345678,
      SortCode: 123456,
      amount: 500
    });

    const updated = await Transaction.findByIdAndUpdate(transaction._id, { amount: 750 }, { new: true });
    expect(updated.amount).toBe(750);
  });

  it('should delete a transaction using deleteOne', async () => {
    const transaction = await Transaction.create({
      userId: 'user123',
      transactionType: 'deposit',
      AccountNumber: 12345678,
      SortCode: 123456,
      amount: 500
    });

    await Transaction.deleteOne({ _id: transaction._id });
    const found = await Transaction.findById(transaction._id);
    expect(found).toBeNull();
  });
});