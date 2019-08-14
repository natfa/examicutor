import AccountSchema, { IAccount } from './schemas/Account';
import AccountModel from '../models/Account';

function saveNewAccount(account: AccountModel): Promise<IAccount> {
  const newAccount = new AccountSchema({
    email: account.email,
    passwordHash: account.passwordHash,
    facultyNumber: account.facultyNumber,
  })

  return newAccount.save();
}

function findAccountByID(accountID: String): Promise<IAccount | null> {
  return AccountSchema.findById(accountID).exec();
}

function findAccountByEmail(email: String): Promise<IAccount | null> {
  return AccountSchema.findOne({ email }).exec();
}

export default {
  saveNewAccount,
  findAccountByID,
  findAccountByEmail,
}