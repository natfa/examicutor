import { query } from './index'

import Account from '../models/Account'

const saveOne = async (account: Account): Promise<Account> => {
  return new Promise<Account>(async(resolve, reject) => {
    return reject(new Error('Not Implemented'))
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
    return reject(new Error('Not Implemented'))
  })
}

export default {
  saveOne,
  getOneById,
  getOneByEmail,
  getAll,
  deleteOneById,
}
