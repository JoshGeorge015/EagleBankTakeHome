import User from "../models/User.js";
// Create a new user
export async function createUser(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const user = await create({ name, email, password });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

// Get user by ID
export async function getUser(req, res, next) {
  try {
    const user = await findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// Update user by ID
export async function updateUser(req, res, next) {
  try {
    const user = await findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// Delete user by ID
export async function deleteUser(req, res, next) {
  try {
    const user = await findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
}