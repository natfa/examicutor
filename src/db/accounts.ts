import { query } from './index';

import { Account } from '../models/Account';
import { OkPacket } from './OkPacket';

export interface AccountsRowDataPacket {
  id: number;
  email: string;
  passwordhash: string;
  isadmin: number; // convertable to boolean
}

export function buildAccount(dataPacket: AccountsRowDataPacket): Account {
  const account: Account = {
    id: String(dataPacket.id),
    email: dataPacket.email,
    passwordHash: dataPacket.passwordhash,
    isAdmin: Boolean(dataPacket.isadmin),
  };

  return account;
}

function saveOne(account: Account): Promise<Account> {
  return new Promise<Account>((resolve, reject) => {
    query({
      sql: `insert into accounts
      (email, passwordhash, isadmin) values
      (?, ?, ?)`,
      values: [account.email, account.passwordHash, account.isAdmin],
    }).then((result: OkPacket) => {
      const accountId = result.insertId;

      resolve({
        id: String(accountId),
        email: account.email,
        passwordHash: account.passwordHash,
        isAdmin: account.isAdmin,
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

function getOneByEmail(email: string): Promise<Account|null> {
  return new Promise<Account|null>((resolve, reject) => {
    query({
      sql: `select *
      from accounts
      where email = ?`,
      values: [email],
    }).then((results: AccountsRowDataPacket[]) => {
      if (results.length === 0) {
        resolve(null);
        return;
      }

      const account = buildAccount(results[0]);
      resolve(account);
    }).catch((err) => {
      reject(err);
    });
  });
}

export default {
  saveOne,
  getOneByEmail,
};
