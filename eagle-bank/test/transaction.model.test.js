// Transaction model unit tests
import Transaction from '../models/Transaction.js';

describe('Transaction Model', () => {
  it('should create a transaction with required fields', () => {
    const transaction = new Transaction({
      userId: 'user123',
      transactionType: 'deposit',
      AccountNumber: 12345678,
      SortCode: 123456,
      amount: 500
    });
    expect(transaction.transactionType).toBe('deposit');
    expect(transaction.AccountNumber).toBe(12345678);
    expect(transaction.SortCode).toBe(123456);
    expect(transaction.amount).toBe(500);
  });
});
