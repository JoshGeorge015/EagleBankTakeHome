
/**
 * Transaction Controller
 * Handles transaction creation and retrieval for user accounts.
 * All responses exclude sensitive information.
 *
 * @module controllers/transactionController
 */
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import mongoose from 'mongoose';

/**
 * Create a new transaction for the authenticated user.
 *
 * @param Request req - Express request object
 * @param Response res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
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

    const checkAccount = await Account.findOne({ userId: req.auth.userId, AccountNumber: req.body.AccountNumber, SortCode: req.body.SortCode, _id: req.params.accountId });

    if (!checkAccount) {
      return res.status(404).json({ message: 'Not Found - Account not found' });
    }
    if(checkAccount.accountStatus !== 'active') {
      return res.status(403).json({ message: 'Forbidden - Inactive account' });
    }
    if(checkAccount.userId !== req.auth.userId || ['withdrawal', 'deposit'].includes(transactionType)==false) {
      return res.status(403).json({ message: 'Forbidden - Unable to perform this transaction' });
    }
    if(transactionType === 'withdrawal') {
      checkAccount.balance -= amount;
    }
    if(transactionType === 'deposit') {
      checkAccount.balance += amount;
    }
    if (checkAccount.balance < 0) {
      return res.status(422).json({ message: 'Unprocessable Entity - Insufficient funds for this transaction' });
    }
    await checkAccount.save();

    const TransactionObj = await Transaction.create({ userId: req.auth.userId, transactionType, AccountNumber, SortCode, amount });

    res.status(201).json({ TransactionObj, status: 'Transaction created successfully' });
  } catch (err) {
    next(err);
  }
}


/**
 * Get all transactions for the authenticated user.
 *
 * @param Request req - Express request object
 * @param Response res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
export async function getTransactions(req, res, next) {
  try {
    const checkAccount = await Account.findById(req.params.accountId);
    if(!checkAccount){
      return res.status(404).json({ message: 'Not Found - Account not found' });
    }
    const transactions = await Transaction.find({ AccountNumber: checkAccount.AccountNumber });
    res.status(200).json({ transactions, status: 'Transactions retrieved successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * Get transaction details by transaction ID for a specific account. Only the account owner can access their transaction.
 *
 * @param Request req - Express request object
 * @param Response res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
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


