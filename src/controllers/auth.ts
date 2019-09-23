import express, { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'

import { validateLoginCredentials } from '../validators/auth'
import { validateAccountBody } from '../validators/account'
import { isAuthenticated } from '../middleware/isAuthenticated'
import { isAdmin } from '../middleware/isAdmin'

import accountdb from '../db/accounts'
import Account from '../models/Account'

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session)
      return next(new Error('req.session is undefined'))

    if (req.session.isAuthenticated)
      return res.status(400).send('Already authenticated')

    const { email, password } = req.body
    const account = await accountdb.getOneByEmail(email)

    if (!account) {
      return res.status(401).end()
    }

    if (!(await bcrypt.compare(password, account.passwordHash))) {
      return res.status(401).end()
    }

    req.session.isAuthenticated = true
    req.session.account = account

    return res.status(200).end()
  }
  catch(err) {
    return next(err)
  }
}

const createAccount = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const saltRounds = 10
    const { email, password, isAdmin } = req.body

    const exists = await accountdb.getOneByEmail(email)
    if (exists) {
      return res.status(400).send('Email already in use')
    }

    // hash
    const pHash = await bcrypt.hash(password, saltRounds)

    let account = new Account(null, email, pHash, isAdmin)
    account = await accountdb.saveOne(account)
    // don't send password hash... duh..
    delete(account.passwordHash)
    return res.status(200).send(account)
  }
  catch(err) {
    return next(err)
  }
}

const getActiveSession = async(req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session)
      return next(new Error('req.session is undefined'))

    if (!req.session.isAuthenticated)
      return res.status(401).end()

    return res.status(200).send({
      email: req.session.account.email,
      isAdmin: req.session.account.isAdmin,
    })
  }
  catch(err) {
    return next(err)
  }
}

const router = express.Router()

router.get('/', getActiveSession)
// The validateLoginCredentials only checks for gramatical errors,
// such as mistyped email or an empty password. The authenticate
// method actually makes the authentication and checks the DB
router.post('/', validateLoginCredentials, authenticate)
router.post('/create', validateAccountBody, isAuthenticated, isAdmin, createAccount)

export default router
