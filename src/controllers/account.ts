import express, { Request, Response } from 'express';
import accountdb from '../db/accounts';
import Account from '../models/Account';

const router = express();

router.post('/', (req: Request, res: Response) => {
  const { email, password, facultyNumber } = req.body;

  const account = new Account(facultyNumber, email, password);
  accountdb.saveNewAccount(account)
    .then((acc) => {
      res.status(200).json(acc);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

export default router;