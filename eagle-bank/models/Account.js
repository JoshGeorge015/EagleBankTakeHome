
/**
 * Account Model
 * Defines the Account schema and model for MongoDB.
 *
 * @module models/Account
 */
import mongoose from 'mongoose';


/**
 * Account schema definition.
 */
const accountSchema = new mongoose.Schema({
  userId: { type: String, required: true, trim: true },
  accountType: { type: String, required: true, trim: true },
  accountStatus: { type: String, enum: ['active', 'inactive', 'suspended'], required: true, trim: true },
  AccountNumber: { type: Number, required: true, trim: true },
  SortCode: { type: Number, required: true, trim: true },
  balance: { type: Number, required: true },
}, { timestamps: true });


/**
 * Find an account by ID.
 * @param {string} enteredId
 * @returns {Promise<Object|null>}
 */
accountSchema.statics.findAccountById = async function (enteredId) {
  return await this.findById(enteredId);
};


const Account = mongoose.model('Account', accountSchema);

export default Account;