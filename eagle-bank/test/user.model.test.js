// tests/User.model.test.js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMODEL' });
});


afterEach(async () => {
  // Clear all collections after each test
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

describe('User Model', () => {
  it('should create and save a user successfully', async () => {
    const userData = { email: 'test@example.com', password: 'secure123', name: 'Test User' };
    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
  });

  it('should fail when required fields are missing', async () => {
    const user = new User({ name: 'No Email' });
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });
});