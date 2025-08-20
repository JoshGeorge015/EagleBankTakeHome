import * as transactionController from '../controllers/transactionController.js';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import { jest } from '@jest/globals';
jest.mock('../models/Account.js', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
    save: jest.fn()
  }
}));

jest.mock('../models/Transaction.js', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn()
  }
}));

describe('Transaction Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, auth: { userId: 'user123' }, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();

    jest.clearAllMocks();

    jest.spyOn(Account, 'findOne').mockResolvedValue(null);
    jest.spyOn(Transaction, 'create').mockResolvedValue({});

  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should have a createTransaction function', () => {
    expect(typeof transactionController.createTransaction).toBe('function');
  });

  it('should create a transaction and return 201', async () => {
    req.body = {
      userId: 'user123',
      transactionType: 'deposit',
      AccountNumber: '12345678',
      SortCode: '123456',
      amount: 500
    };

    const fakeAccount = {
      id: 'acc1',
      userId: 'user123',
      balance: 1000,
      accountStatus: 'active',
      AccountNumber: '12345678',
      SortCode: '123456',
      save: jest.fn()
    };
    Account.save.mockResolvedValue(fakeAccount);
    Transaction.create.mockResolvedValue({ ...req.body });

    await transactionController.createTransaction(req, res, next);


    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: expect.any(String) }));
    expect(fakeAccount.save).toHaveBeenCalled();
  });

  it('should return 400 if required fields are missing', async () => {
    req.body = { transactionType: 'deposit' };

    await transactionController.createTransaction(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });

  it('should return 404 if account not found', async () => {
    req.body = {
      transactionType: 'deposit',
      AccountNumber: '12345678',
      SortCode: '123456',
      amount: 500
    };

    Account.findOne.mockResolvedValue(null);

    await transactionController.createTransaction(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });

  it('should return 403 if user is not account owner', async () => {
    req.body = {
      transactionType: 'deposit',
      AccountNumber: '12345678',
      SortCode: '123456',
      amount: 500
    };

    const fakeAccount = {
      id: 'acc1',
      userId: 'otherUser',
      balance: 1000,
      save: jest.fn()
    };

    Account.findOne.mockResolvedValue(fakeAccount);

    await transactionController.createTransaction(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });

  it('should return 422 if insufficient funds for withdrawal', async () => {
    req.body = {
      transactionType: 'withdrawal',
      AccountNumber: '12345678',
      SortCode: '123456',
      amount: 2000
    };

    const fakeAccount = {
      id: 'acc1',
      userId: 'user123',
      balance: 1000,
      save: jest.fn()
    };

    Account.findOne.mockResolvedValue(fakeAccount);

    await transactionController.createTransaction(req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });

  it('should call next(err) on unexpected error', async () => {
    req.body = {
      transactionType: 'deposit',
      AccountNumber: '12345678',
      SortCode: '123456',
      amount: 500
    };

    // Account.findOne.mockRejectedValue(new Error('DB error'));

    await transactionController.createTransaction(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});