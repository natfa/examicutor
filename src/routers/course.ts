import express, { Request, Response, NextFunction } from 'express';

import courseController from '../controllers/course';

// import isAuthenticated from '../middleware/isAuthenticated';

async function getAllCourses(_: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const courses = await courseController.getAllCourses();

    res.status(200).json(courses);
  } catch (err) {
    next(err);
  }
}

const router = express.Router();

// router.use(isAuthenticated);

router.get('/', getAllCourses);

export default router;
