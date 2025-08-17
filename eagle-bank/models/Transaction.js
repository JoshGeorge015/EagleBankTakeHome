
/**
 * Transaction Model
 * Defines the Transaction schema and model for MongoDB.
 *
 * @module models/Transaction
 */
import mongoose from 'mongoose';


/**
 * Transaction schema definition.
 */
const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true, trim: true },
  transactionType: { type: String, enum: ['deposit', 'withdrawal'], required: true, trim: true },
  AccountNumber: { type: Number, required: true, trim: true },
  SortCode: { type: Number, required: true, trim: true },
  amount: { type: Number, required: true },
}, { timestamps: true });


/**
 * Find a transaction by ID.
 * @param {string} enteredId
 * @returns {Promise<Object|null>}
 */
transactionSchema.statics.findTransactionById = async function (enteredId) {
  return await this.findById(enteredId);
};


const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;