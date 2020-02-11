import express, { Request, Response, NextFunction } from 'express';

import isAuthenticated from '../middleware/isAuthenticated';

import studentController from '../controllers/student';

async function getStudent(req: Request, res: Response, next: NextFunction) {
  if (req.session === undefined) throw new Error('req.session is undefined');

  try {
    const student = await  studentController.getStudentByAccountId(req.session.account.id);

    if (student === null) {
      res.status(400).end();
      return;
    }

    res.status(200).send(student);
  } catch (err) {
    next(err);
  }
}

const router = express.Router();

router.use(isAuthenticated);

router.get('/', getStudent);

export default router;
