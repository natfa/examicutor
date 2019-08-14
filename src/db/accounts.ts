import AccountSchema, { IAccount } from './schemas/Account';
import AccountModel from '../models/Account';

function saveAccount(account: AccountModel): Promise<IAccount> {
  const newAccount = new AccountSchema({
    email: account.email,
    passwordHash: account.passwordHash,
  })

  return newAccount.save();
}

export default {
  saveAccount,
}