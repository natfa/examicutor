import { query } from './index'

import Account from '../models/Account'

const saveOne = async (account: Account): Promise<Account> => {
  return new Promise<Account>(async(resolve, reject) => {
    try {
      const result = await query({
        sql: `insert into accounts
        (email, passwordhash, isadmin) values
        (?, ?, ?)`,
        values: [account.email, account.passwordHash, account.isAdmin],
      })

      const accountid = result.insertId

      return resolve(new Account(
        String(accountid),
        account.email,
        account.passwordHash,
        account.isAdmin,
      ))
    }
    catch(err) {
      return reject(err)
    }
  })
}

const getOneById = async (id: string): Promise<Account|null> => {
  return new Promise<Account|null>(async(resolve, reject) => {
    return reject(new Error('Not Implemented'))
  })
}

const getAll = async (): Promise<Array<Account>> => {
  return new Promise<Array<Account>>(async(resolve, reject) => {
    return reject(new Error('Not Implemented'))
  })
}

const deleteOneById = async (id: string): Promise<boolean> => {
  return new Promise<boolean>(async(resolve, reject) => {
    return reject(new Error('Not Implemented'))
  })
}

const getOneByEmail = async (email: string): Promise<Account|null> => {
  return new Promise<Account|null>(async(resolve, reject) => {
    try {
      const results = await query({
        sql: `select id, email, passwordhash, isadmin
        from accounts
        where email = ?`,
        values: [email],
      })

      if (results.length === 0)
        return resolve(null)

      const accountResult = results[0]
      return resolve(new Account(
        String(accountResult.id),
        accountResult.email,
        accountResult.passwordhash,
        Boolean(accountResult.isadmin),
      ))
    }
    catch(err) {
      return reject(err)
    }
  })
}

export default {
  saveOne,
  getOneById,
  getOneByEmail,
  getAll,
  deleteOneById,
}
