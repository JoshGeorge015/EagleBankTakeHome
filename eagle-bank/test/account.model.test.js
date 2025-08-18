// Account model unit tests
import Account from '../models/Account.js';

describe('Account Model', () => {
  it('should create an account with required fields', () => {
    const account = new Account({
      userId: 'user123',
      accountType: 'savings',
      accountStatus: 'active',
      AccountNumber: 12345678,
      SortCode: 123456,
      balance: 1000
    });
    expect(account.accountType).toBe('savings');
    expect(account.accountStatus).toBe('active');
    expect(account.AccountNumber).toBe(12345678);
    expect(account.SortCode).toBe(123456);
    expect(account.balance).toBe(1000);
  });
});
