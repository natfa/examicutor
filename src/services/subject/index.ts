import { Request, Response, NextFunction } from 'express';

import subjectdb from '../../db/subjects';

async function getSubjects(_: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subjects = await subjectdb.getAll();
    res.status(200).send(subjects);
  } catch (err) {
    next(err);
  }
};

export default {
  getSubjects,
}
