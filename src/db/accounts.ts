import { query } from './index'

import Account from '../models/Account'

const getAccountById = (accountId: String): Promise<Account|null> => {
  return new Promise<Account|null>((resolve, reject) => {
  });
}

const getAccountByEmail = (email: String): Promise<Account|null> => {
  return new Promise<Account|null>((resolve, reject) => {
  });
}

const saveAccount = (accout: Account): Promise<Account> => {
  return new Promise<Account>((resolve, reject) => {
  });
}

export default {
  getAccountById,
  getAccountByEmail,
  saveAccount,
}
