import { query } from './index';

import Account from '../models/Account';

function saveOne(account: Account): Promise<Account> {
  return new Promise<Account>((resolve, reject) => {
    query({
      sql: `insert into accounts
      (email, passwordhash, isadmin) values
      (?, ?, ?)`,
      values: [account.email, account.passwordHash, account.isAdmin],
    }).then((result) => {
      const accountId = result.insertId;

      return resolve(new Account(
        String(accountId),
        account.email,
        account.passwordHash,
        account.isAdmin,
      ));
    }).catch((err) => {
      reject(err);
    });
  });
}

function getOneById(id: string): Promise<Account|null> {
  return new Promise<Account|null>((resolve, reject) => {
    reject(new Error('Not implemented'));
  });
}


function getAll(): Promise<Array<Account>> {
  return new Promise<Array<Account>>((resolve, reject) => {
    reject(new Error('Not Implemented'));
  });
}

function deleteOneById(id: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    reject(new Error('Not Implemented'));
  });
}

function getOneByEmail(email: string): Promise<Account|null> {
  return new Promise<Account|null>((resolve, reject) => {
    query({
      sql: `select id, email, passwordhash, isadmin
      from accounts
      where email = ?`,
      values: [email],
    }).then((results) => {
      if (results.length === 0) {
        resolve(null);
        return;
      }

      const accountResult = results[0];

      resolve(new Account(
        String(accountResult.id),
        accountResult.email,
        accountResult.passwordhash,
        Boolean(accountResult.isadmin),
      ));
    }).catch((err) => {
      reject(err);
    });
  });
}

export default {
  saveOne,
  getOneById,
  getOneByEmail,
  getAll,
  deleteOneById,
};
