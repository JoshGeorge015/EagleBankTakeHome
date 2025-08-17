import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: { type: String, required: true, trim: true },
    transactionType: { type: String, enum: ['deposit', 'withdrawal'], required: true, trim: true },
    AccountNumber: { type: Number, required: true, trim: true },
    SortCode: { type: Number, required: true, trim: true },
    amount: { type: Number, required: true },
}, { timestamps: true });

transactionSchema.statics.findTransactionById = async function (enteredId) {
  return await this.findById(enteredId);
};


const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;