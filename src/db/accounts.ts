import { query } from './index';

import { Account } from '../models/Account';
import { OkPacket } from './OkPacket';

// keep in sync with allRoles constant from constants/index.ts
export interface AccountsRowDataPacket {
  id: number;
  email: string;
  passwordhash: string;
  roles: ('admin'|'student'|'teacher');
}

export function buildAccount(dataPacket: AccountsRowDataPacket): Account {
  // assume db returned correct values
  const roles = dataPacket.roles.split(',') as ('admin'|'student'|'teacher')[];

  const account: Account = {
    id: String(dataPacket.id),
    email: dataPacket.email,
    passwordHash: dataPacket.passwordhash,
    roles,
  };

  return account;
}

function saveOne(account: Account): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    query({
      sql: `insert into accounts
      (email, passwordhash, roles) values
      (?, ?, ?)`,
      values: [
        account.email,
        account.passwordHash,
        account.roles.join(','),
      ],
    }).then((result: OkPacket) => {
      const accountId = String(result.insertId);

      resolve(accountId);
    }).catch((err) => {
      reject(err);
    });
  });
}

function getOneByEmail(email: string): Promise<Account|null> {
  return new Promise<Account|null>((resolve, reject) => {
    query({
      sql: `select * from accounts
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
