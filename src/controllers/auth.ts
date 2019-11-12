import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

import { validateLoginCredentials } from '../validators/auth';
import { validateAccountBody } from '../validators/account';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { isAdmin } from '../middleware/isAdmin';

import accountdb from '../db/accounts';
import Account from '../models/Account';

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.session) {
      next(new Error('req.session is undefined'));
      return;
    }

    if (req.session.isAuthenticated) {
      res.status(400).send('Already authenticated');
      return;
    }

    const { email, password } = req.body;
    const account = await accountdb.getOneByEmail(email);

    if (!account) {
      res.status(401).end();
      return;
    }

    if (!(await bcrypt.compare(password, account.passwordHash))) {
      res.status(401).end();
      return;
    }

    req.session.isAuthenticated = true;
    req.session.account = account;

    // don't send pass hash
    delete account.passwordHash;

    res.status(200).send(account);
  } catch (err) {
    next(err);
  }
};

const createAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const saltRounds = 10;
    const { email, password, admin } = req.body;

    const exists = await accountdb.getOneByEmail(email);
    if (exists) {
      res.status(400).send('Email already in use');
      return;
    }

    // hash
    const pHash = await bcrypt.hash(password, saltRounds);

    let account: Account = {
      id: undefined,
      email,
      passwordHash: pHash,
      isAdmin: admin,
    }

    account = await accountdb.saveOne(account);
    // don't send password hash... duh..
    delete account.passwordHash;
    res.status(200).send(account);
    return;
  } catch (err) {
    next(err);
  }
};

const getActiveSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.session) {
      next(new Error('req.session is undefined'));
      return;
    }

    if (!req.session.isAuthenticated) {
      res.status(401).end();
      return;
    }

    res.status(200).send({
      email: req.session.account.email,
      isAdmin: req.session.account.isAdmin,
    });
  } catch (err) {
    next(err);
  }
};

const router = express.Router();

router.get('/', getActiveSession);
// The validateLoginCredentials only checks for gramatical errors,
// such as mistyped email or an empty password. The authenticate
// method actually makes the authentication and checks the DB
router.post('/', validateLoginCredentials, authenticate);
router.post('/create', validateAccountBody, isAuthenticated, isAdmin, createAccount);

export default router;
