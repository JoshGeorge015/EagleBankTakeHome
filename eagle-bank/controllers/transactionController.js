import Account from "../models/Account.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import mongoose from 'mongoose';

// Create a new Transaction
export async function createTransaction(req, res, next) {
  try {
    const { transactionType, AccountNumber, SortCode, amount } = req.body;
    if (!transactionType || !AccountNumber || !SortCode || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (transactionType.length < 2 || AccountNumber.length < 6 || SortCode.length < 6 || amount < 0) {
      return res.status(400).json({
        message: 'Invalid Transaction details, please ensure your transactionType is at least 2 characters, AccountNumber, SortCode are valid numbers, and amount is a positive number.'
      });
    }
    const checkAccount = await Account.findOne({ AccountNumber, SortCode });
    if (!checkAccount.id) {
      return res.status(404).json({ message: 'Account not found' });
    }
    if(checkAccount.userId !== req.auth.userId && transactionType in ['withdrawal', 'deposit']) {
      return res.status(403).json({ message: 'Forbidden - Unable to perform this transaction' });
    }
    if(transactionType === 'withdrawal') {
      checkAccount.balance -= amount;
    }
    if(transactionType === 'deposit') {
      checkAccount.balance += amount;
    }
    if (checkAccount.balance < 0) {
      return res.status(422).json({ message: 'Insufficient funds for this transaction' });
    }
    await checkAccount.save();

    const TransactionObj = await Transaction.create({ userId: req.auth.userId, transactionType, AccountNumber, SortCode, amount });
    res.status(201).json({ TransactionObj, status: 'Transaction created successfully' });
  } catch (err) {
    next(err);
  }
}


export async function getTransactions(req, res, next) {
  try {
    const transactions = await Transaction.find({ userId: req.auth.userId });
    // TODO: add fix for user transactions on another user account/non existent account
    res.status(200).json({ transactions, status: 'Transactions retrieved successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getTransaction(req, res, next) {
  try {
    const { accountId, transactionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ message: 'Invalid Transaction ID format' });
    }

    const transactionDetails = await Transaction.findById(transactionId);
    const AccountDetails = await Account.findById(accountId);
    if (!AccountDetails) {
      return res.status(404).json({ message: 'Account not found' });
    }
    if (!transactionDetails) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    if (AccountDetails.AccountNumber !== transactionDetails.AccountNumber) {
      return res.status(403).json({ message: 'Forbidden - Unable to access another account\'s transaction details' });
    }
    if (req.auth.userId !== transactionDetails.userId) {
      return res.status(403).json({ message: 'Forbidden - Unable to access another user\'s transaction details' });
    }
 


    res.status(200).json({ Transaction: transactionDetails, status: 'Transaction retrieved successfully' });
  } catch (err) {
    next(err);
  }
}


