import express, { Request, Response, NextFunction } from 'express';

import { isAuthenticated } from '../middleware/isAuthenticated';

import subjectdb from '../db/subjects';

const createSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name } = req.body;
    const subject = await subjectdb.saveOne({ id: undefined, name });
    res.status(201).send(subject);
  } catch (err) {
    next(err);
  }
};

const getAllSubjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const subjects = await subjectdb.getAll();
    res.status(200).send(subjects);
  } catch (err) {
    next(err);
  }
};

const deleteSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const success = await subjectdb.deleteOneById(req.params.id);
    if (!success) {
      res.status(400).end();
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};


const router = express.Router();

router.use(isAuthenticated);

router.get('/', getAllSubjects);
// router.post('/', createSubject);
// router.delete('/:id', deleteSubject);


export default router;
