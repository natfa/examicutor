import { Request, Response, NextFunction } from 'express';

import { Student } from '../../models/Student';

async function getStudent(req: Request, res: Response, next: NextFunction) {
  if (req.session === undefined) throw new Error('req.session is undefined');

  try {
    const student = await Student.findOne({
      where: {
        userId: req.session.user.id,
      }
    });

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
