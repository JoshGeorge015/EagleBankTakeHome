import { createUser } from '../controllers/userController.js';
import { jest } from '@jest/globals';

jest.mock('../models/User.js', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteOne: jest.fn()
  }
}));

import User from '../models/User.js';

describe('User Controller', () => {
  let next;
  beforeEach(() => {
    next = jest.fn();
    jest.clearAllMocks();
  });


  it('should create a user and return 201', async () => {
    const req = {
      body: { email: 'test@example.com', password: 'secure123', name: 'Test User' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    jest.spyOn(User, 'create').mockResolvedValue("success");
    User.findOne.mockResolvedValue(null); // check there is no existing user
    User.create.mockResolvedValue({
      ...req.body,
      toObject: function() { return { ...this }; }
    });

    await createUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ user: expect.objectContaining({ email: 'test@example.com' }) }));
  });

  it('should return 400 if required fields are missing', async () => {
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });

  it('should call next(err) on unexpected error', async () => {
    const req = {
      body: { email: 'test@example.com', password: 'secure123', name: 'Test User' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    User.findOne.mockRejectedValue(new Error('DB error'));

    await createUser(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});