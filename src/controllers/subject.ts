import express, { Request, Response, NextFunction } from 'express';

import isAuthenticated from '../middleware/isAuthenticated';

import subjectdb from '../db/subjects';

const getAllSubjects = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const subjects = await subjectdb.getAll();
    res.status(200).send(subjects);
  } catch (err) {
    next(err);
  }
};

const router = express.Router();

router.use(isAuthenticated);

router.get('/', getAllSubjects);

export default router;
