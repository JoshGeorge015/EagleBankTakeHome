import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Account from '../models/Account.js';

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

describe('Account Model', () => {
  it('should create and save an account successfully', async () => {
    const accountData = {
      userId: 'user123',
      accountType: 'savings',
      accountStatus: 'active',
      AccountNumber: 12345678,
      SortCode: 123456,
      balance: 1000
    };

    const account = new Account(accountData);
    const savedAccount = await account.save();

    expect(savedAccount._id).toBeDefined();
    expect(savedAccount.accountType).toBe(accountData.accountType);
    expect(savedAccount.balance).toBe(accountData.balance);
  });

  it('should fail when required fields are missing', async () => {
    const account = new Account({ accountType: 'savings' }); // missing required fields
    let err;
    try {
      await account.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.userId).toBeDefined();
    expect(err.errors.AccountNumber).toBeDefined();
  });

  it('should find an account by AccountNumber and SortCode', async () => {
    const accountData = {
      userId: 'user123',
      accountType: 'savings',
      accountStatus: 'active',
      AccountNumber: 12345678,
      SortCode: 123456,
      balance: 1000
    };

    await Account.create(accountData);
    const found = await Account.findOne({ AccountNumber: 12345678, SortCode: 123456 });

    expect(found).not.toBeNull();
    expect(found.userId).toBe(accountData.userId);
  });

  it('should update an account balance using findByIdAndUpdate', async () => {
    const account = await Account.create({
      userId: 'user123',
      accountType: 'savings',
      accountStatus: 'active',
      AccountNumber: 12345678,
      SortCode: 123456,
      balance: 1000
    });

    const updated = await Account.findByIdAndUpdate(account._id, { balance: 1500 }, { new: true });
    expect(updated.balance).toBe(1500);
  });

  it('should delete an account using deleteOne', async () => {
    const account = await Account.create({
      userId: 'user123',
      accountType: 'savings',
      accountStatus: 'active',
      AccountNumber: 12345678,
      SortCode: 123456,
      balance: 1000
    });

    await Account.deleteOne({ _id: account._id });
    const found = await Account.findById(account._id);
    expect(found).toBeNull();
  });
});