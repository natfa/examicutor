import { Request, Response, NextFunction } from 'express';

import studentdb from '../../db/students';

async function getStudent(req: Request, res: Response, next: NextFunction) {
  if (req.session === undefined) throw new Error('req.session is undefined');

  try {
    const student = await  studentdb.getStudentByAccountId(req.session.account.id);

    if (student === null) {
      res.status(400).end();
      return;
    }

    res.status(200).send(student);
  } catch (err) {
    next(err);
  }
}

export default {
  getStudent,
}
