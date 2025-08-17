import Account from "../models/Account.js";
import User from "../models/User.js";
import mongoose from 'mongoose';

// Create a new Account
export async function createAccount(req, res, next) {
  try {
    const { accountType, accountStatus, AccountNumber, SortCode, balance } = req.body;
    console.log(req.body);
    if (!accountType || !accountStatus || !AccountNumber || !SortCode || !balance) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (accountType.length < 2 || accountStatus.length < 5 || AccountNumber.length < 6 || SortCode.length < 6 || balance < 0) {
      return res.status(400).json({
        message: 'Invalid Account details, please ensure your accountType is at least 2 characters, accountStatus is at least 5 characters, and AccountNumber, SortCode are valid numbers.'
      });
    }

    const existing = await Account.findOne({ AccountNumber });
    if (existing) {
      return res.status(409).json({ message: 'Existing account found, unable to create' });
    }

    const AccountObj = await Account.create({ userId: req.auth.userId, accountType, accountStatus, AccountNumber, SortCode, balance });
    const UserObj = await User.findByIdAndUpdate( req.auth.userId, { bankAccount: true }); //updateUser

    res.status(201).json({ AccountObj, status: 'Account created successfully' });
  } catch (err) {
    next(err);
  }
}


export async function getAccounts(req, res, next) {
  try {
    const accounts = await Account.find({ userId: req.auth.userId });
    res.status(200).json({ accounts, status: 'Accounts retrieved successfully' });
  } catch (err) {
    next(err);
  }
}


// Get Account by ID
export async function getAccount(req, res, next) {
  try {
    const { accountId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ message: 'Invalid Account ID format' });
    }
 
    const AccountDetails = await Account.findById(accountId);
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


export async function updateAccount(req, res, next) {
  try {
    const { accountId } = req.params;
    const AccountDetails = await Account.findById(accountId);

    if (!AccountDetails) {
      return res.status(404).json({ message: 'Account not found' });
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
      req.params.AccountId,
      updateFields,
      { new: true, runValidators: true }
    );


    return res.status(200).json({ AccountDetailsUpdated: AccountDetailsUpdated , message: 'Account updated successfully' });
  } catch (err) {
    next(err);
  }
}

// Delete Account by ID
export async function deleteAccount(req, res, next) {
  try {
    const { accountId } = req.params;
    const AccountDetails = await Account.findById(accountId);
    if (!AccountDetails) {
      return res.status(404).json({ message: 'Account not found' });
    }
    if (req.auth.userId !== AccountDetails.userId) {
      return res.status(403).json({ message: 'Forbidden - Unable to delete another Account' });
    }

    const AccountToDelete = await Account.findByIdAndDelete(req.params.accountId);

    res.status(200).json({ message: 'Account deleted' });
  } catch (err) {
    next(err);
  }
}