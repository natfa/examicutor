import express, { Request, Response, NextFunction } from 'express';

import specialtyController from '../controllers/specialty';

// import isAuthenticated from '../middleware/isAuthenticated';

async function getAllSpecialties(_: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const specialties = await specialtyController.getAllSpecialties();

    res.status(200).json(specialties);
  } catch (err) {
    next(err);
  }
}

const router = express.Router();

// router.use(isAuthenticated);

router.get('/', getAllSpecialties);

export default router;
