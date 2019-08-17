import AccountSchema, { IAccount } from './schemas/Account';
import AccountModel from '../models/Account';

const schemaToModel = (schema: IAccount): AccountModel => {
  return new AccountModel(
    schema.id,
    schema.facultyNumber,
    schema.email,
    schema.passwordHash,
  )
}

const saveAccount = (account: AccountModel): Promise<AccountModel> => {
  const newAccount = new AccountSchema({
    email: account.email,
    passwordHash: account.passwordHash,
    facultyNumber: account.facultyNumber,
  });

  return new Promise<AccountModel>((resolve, reject) => {
    newAccount.save()
      .then((savedAccount) => {
        return resolve(schemaToModel(savedAccount));
      })
      .catch((err) => {
        return reject(err);
      });
  })
}

const getAccountById = (accountID: String): Promise<AccountModel | null> => {
  return new Promise<AccountModel | null>((resolve, reject) => {
    AccountSchema.findById(accountID)
      .then((account) => {
        if (account === null || account === undefined) {
          return resolve(null);
        }
        return resolve(schemaToModel(account));
      })
      .catch((err) => {
        return reject(err);
      });
  })
}

const getAccountByEmail = (email: String): Promise<AccountModel | null> => {
  return new Promise<AccountModel | null>((resolve, reject) => {
    AccountSchema.findOne({ email })
      .then((schema) => {
        if (schema === null || schema === undefined)
          return resolve(null);
        return resolve(schemaToModel(schema));
      })
      .catch((err) => reject(err));
  });
}

export default {
  saveAccount,
  getAccountById,
  getAccountByEmail,
}
