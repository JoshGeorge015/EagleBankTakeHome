import User from "../models/User.js";
import mongoose from 'mongoose';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Create a new user
export async function createUser(req, res, next) {
  try {
    const { name, email, password, description } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (name.length < 2 || email.length < 5 || password.length < 6) {
      return res.status(400).json({
        message: 'Invalid User details, please ensure your name is at least 2 characters, email is at least 5 characters, and password is at least 6 characters long.'
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const user = await User.create({ name, email, password, description });
    const token = jsonwebtoken.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ user: userObj, token });
  } catch (err) {
    next(err);
  }
}

// Get user by ID
export async function getUser(req, res, next) {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    if (req.auth.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden - Unable to access another user details' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

// Login user
export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jsonwebtoken.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const userObj = user.toObject();
    delete userObj.password;
    res.cookie('token', token, { httpOnly: true });

    res.status(200).json({ user: userObj, token });
  } catch (err) {
    next(err);
  }
}

export async function logoutUser(req, res, next) {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
}

export async function updateUser(req, res, next) {
  try {
    if (req.auth.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Forbidden - Unable to update another user details' });
    }

    const updateFields = {};
    const allowedFields = ['name', 'email', 'password', 'description'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({ user: userObj , message: 'User updated successfully' });
  } catch (err) {
    next(err);
  }
}

// Delete user by ID
export async function deleteUser(req, res, next) {
  try {
    if (req.auth.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Forbidden - Unable to delete another user' });
    }

    const userbnkAcc = await User.findById(req.params.userId);
    if(userbnkAcc.bankAccount===true){
      return res.status(403).json({ message: 'Unable to delete as user has bank account' });

    }

    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
}