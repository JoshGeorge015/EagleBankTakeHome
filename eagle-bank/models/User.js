
/**
 * User Model
 * Defines the User schema and model for MongoDB.
 *
 * @module models/User
 */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


/**
 * User schema definition.
 */
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  bankAccount: { type: Boolean, default: false },
  password: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });


/**
 * Hash password before saving the user.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


/**
 * Compare entered password with hashed password.
 * @param {string} enteredPassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


/**
 * Find a user by ID.
 * @param {string} enteredId
 * @returns {Promise<Object|null>}
 */
userSchema.statics.findUserById = async function (enteredId) {
  return await this.findById(enteredId);
};


/**
 * Find a user by name and email.
 * @param {string} name
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
userSchema.statics.findByNameAndEmail = async function (name, email) {
  return await this.findOne({ name, email });
};


const User = mongoose.model('User', userSchema);

export default User;