import { Request, Response, NextFunction } from 'express';

import { Subject } from '../../models/Subject';

async function getSubjects(_: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subjects = await Subject.findAll();
    res.status(200).send(subjects);
  } catch (err) {
    next(err);
  }
};

export default {
  getSubjects,
}
