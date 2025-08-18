// Account controller unit tests
  import * as accountController from '../controllers/accountController.js';

import { jest } from '@jest/globals';

 jest.mock('../models/Account.js', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteOne: jest.fn()
  }
}));

jest.mock('../models/User.js', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

  import Account from '../models/Account.js';
  import User from '../models/User.js';

  describe('Account Controller', () => {
    let req, res, next;
    beforeEach(() => {
      req = { body: {}, auth: { userId: 'user123' }, params: {} };
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      next = jest.fn();
      jest.clearAllMocks();
    });

    it('should have a createAccount function', () => {
      expect(typeof accountController.createAccount).toBe('function');
    });

    it('should create an account and return 201', async () => {
      req.body = {
        accountType: 'savings',
        accountStatus: 'active',
        AccountNumber: '12345678',
        SortCode: '123456',
        balance: 1000
      };

      Account.findOne.mockResolvedValue(null);
      Account.create.mockResolvedValue({ ...req.body });
      User.findByIdAndUpdate.mockResolvedValue({ bankAccount: true });

      await accountController.createAccount(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: expect.any(String) }));
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = { accountType: 'savings' };
      await accountController.createAccount(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
    });

    it('should return 409 if account already exists', async () => {
      req.body = {
        accountType: 'savings',
        accountStatus: 'active',
        AccountNumber: '12345678',
        SortCode: '123456',
        balance: 1000
      };
      Account.findOne.mockResolvedValue({});
      await accountController.createAccount(req, res, next);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
    });

    it('should call next(err) on unexpected error', async () => {
      req.body = {
        accountType: 'savings',
        accountStatus: 'active',
        AccountNumber: '12345678',
        SortCode: '123456',
        balance: 1000
      };
      Account.findOne.mockRejectedValue(new Error('DB error'));
      await accountController.createAccount(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
    });
