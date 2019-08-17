import express, { Request, Response } from 'express';
import accountdb from '../db/accounts';

import isAuthenticated from './middleware/isAuthenticated';

const router = express();

router.post('/', (req: Request, res: Response) => {
  const { email, password } = req.body;

  accountdb.getAccountByEmail(email)
    .then((acc) => {
      if (!acc)
        return res.status(404).send('Not Found');

      if (acc.passwordHash === password) {
        if (req.session) {
          req.session.account = acc;
          req.session.isAuthenticated = true;
        }
        return res.status(201).send('Authenticated');
      }
      else {
        return res.status(400).send('Wrong credentials');
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    })
})

router.get('/', isAuthenticated, (req, res) => {
  if (req.session) {
    res.status(200).send(req.session.account);
  } else {
    res.status(200).send(`You're authenticaed`);
  }
})

export default router;
