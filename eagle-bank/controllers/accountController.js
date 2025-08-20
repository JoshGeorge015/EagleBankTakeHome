
/**
 * Account Controller
 * Handles account creation, retrieval, updating, and deletion for users.
 * All responses exclude sensitive information.
 *
 * @module controllers/accountController
 */
import Account from "../models/Account.js";
import User from "../models/User.js";
import mongoose from 'mongoose';

/**
 * Create a new account for the authenticated user.
 *
 * @param Request req - Express request object
 * @param Response res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
export async function createAccount(req, res, next) {
  try {
    const { accountType, accountStatus, SortCode, balance, AccountNumber } = req.body;

    if (!accountType || !accountStatus ||  !SortCode || !balance || !AccountNumber) {
      return res.status(400).json({ message: 'Bad Request - Missing required fields' });
    }
    if (accountType.length < 2 || accountStatus.length < 5 || SortCode.length < 6 || balance < 0 || AccountNumber.length < 6) {
      return res.status(400).json({
        message: 'Invalid Account details, please ensure your accountType is at least 2 characters, accountStatus is at least 5 characters, and SortCode is at least 6 characters long, and balance is a valid number.'
      });
    }

    const existing = await Account.exists({ AccountNumber: AccountNumber, SortCode: SortCode });
    if (existing) {
      return res.status(409).json({ message: 'Conflict - Existing account found, unable to create' });
    }

    const AccountObj = await Account.create({ userId: req.auth.userId, accountType, accountStatus, SortCode, balance, AccountNumber  });
    const UserObj = await User.findByIdAndUpdate( req.auth.userId, { bankAccount: true }); //updateUser

    res.status(201).json({ AccountObj: AccountObj, accountId: AccountObj.id, status: 'Account created successfully' });
  } catch (err) {
    next(err);
  }
}


/**
 * Get all accounts for the authenticated user.
 *
 * @param Request req - Express request object
 * @param Response res - Express response object
 * @param {Function} next - Express next middleware function 
 * @returns {Promise<void>}
 */
export async function getAccounts(req, res, next) {
  try {
    const accounts = await Account.find({ userId: req.auth.userId });
    res.status(200).json({ accounts, status: 'Accounts retrieved successfully' });
  } catch (err) {
    next(err);
  }
}


/**
 * Get account details by account ID. Only the account owner can access their account.
 *
 * @param Request req - Express request object
 * @param Response res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
export async function getAccount(req, res, next) {
  try {
    const { accountId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ message: 'Invalid Account ID format' });
    }
 
    const AccountDetails = await Account.findById(accountId);
    console.log(AccountDetails);
    if (req.auth.userId !== AccountDetails.userId) {
      return res.status(403).json({ message: 'Forbidden - Unable to access another Account details' });
    }
    if (!AccountDetails) {
       return res.status(404).json({ message: 'Account not found' });
    }

    res.status(200).json({ Account: AccountDetails, status: 'Account retrieved successfully' });
  } catch (err) {
    next(err);
  }
}


/**
 * Update account details. Only the account owner can update their account.
 *
 * @param Request req - Express request object
 * @param Response res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
export async function updateAccount(req, res, next) {
  try {
    const { accountId } = req.params;
    const AccountDetails = await Account.findById(accountId);

    if (!AccountDetails) {
      return res.status(404).json({ message: 'Not Found - Account not found' });
    }
    if (req.auth.userId !== AccountDetails.userId) {
      return res.status(403).json({ message: 'Forbidden - Unable to update another Account details' });
    }

    const updateFields = {};
    const allowedFields = ['name', 'email', 'password', 'description'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    const AccountDetailsUpdated = await Account.findByIdAndUpdate(
      req.params.accountId,
      updateFields,
      { new: true, runValidators: true }
    );


    return res.status(200).json({ AccountDetailsUpdated: AccountDetailsUpdated , message: 'Account updated successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete an account by ID. Only the account owner can delete their account.
 *
 * @param Request req - Express request object
 * @param Response res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
export async function deleteAccount(req, res, next) {
  try {
    const { accountId } = req.params;
    const AccountDetails = await Account.findById(accountId);
    if (!AccountDetails) {
      return res.status(404).json({ message: 'Not Found - Account not found' });
    }
    if (req.auth.userId !== AccountDetails.userId) {
      return res.status(403).json({ message: 'Forbidden - Unable to delete another Account' });
    }

    const AccountToDelete = await Account.findByIdAndDelete(req.params.accountId);
    const accounts = await Account.find({ userId: req.auth.userId });
    if(accounts.length===0) {
      await User.findByIdAndUpdate(req.auth.userId, { bankAccount: false });
    }
    res.status(200).json({ message: 'Account deleted' });
  } catch (err) {
    next(err);
  }
}