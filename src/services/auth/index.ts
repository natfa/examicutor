import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';

import { Account } from '../../models/Account';
import accountdb from '../../db/accounts';

interface AuthenticationRequestBody {
  email: string;
  password: string;
}

interface AccountRequestBody {
  email: string;
  password: string;
  roles: ('admin'|'student'|'teacher')[];
}

async function getActiveSession(req: Request, res: Response): Promise<void> {
  if (!req.session) throw new Error('req.session is undefined');

  res.status(200).send({
    email: req.session.account.email,
    roles: req.session.account.roles,
  });
};

async function createAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const saltRounds = 10;
    const { email, password, roles } = req.body as AccountRequestBody;

    const exists = await accountdb.getOneByEmail(email);
    if (exists) {
      res.status(400).send('Email already in use');
      return;
    }

    // hash
    const pHash = await bcrypt.hash(password, saltRounds);

    const account: Account = {
      id: undefined,
      email,
      passwordHash: pHash,
      roles,
    };

    const accountId = await accountdb.saveOne(account);

    // don't send password hash... duh..
    delete account.passwordHash;
    res.status(200).json({ accountId });
  } catch (err) {
    next(err);
  }
};

async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.session) throw new Error('req.session is undefined');

    if (req.session.account) {
      res.status(400).send('Already authenticated');
      return;
    }

    const { email, password } = req.body as AuthenticationRequestBody;
    const account = await accountdb.getOneByEmail(email);

    if (!account) {
      res.status(401).end();
      return;
    }

    const passwordMatches = await bcrypt.compare(password, account.passwordHash);

    if (!passwordMatches) {
      res.status(401).end();
      return;
    }

    req.session.account = account;

    // don't send pass hash
    delete account.passwordHash;
    res.status(200).send(account);
  } catch (err) {
    next(err);
  }
};

export default {
  authenticate,
  getActiveSession,
  createAccount,
}
