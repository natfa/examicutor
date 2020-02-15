import { Request, Response, NextFunction } from 'express';

import specialtiesDB from '../../db/specialties';

async function getAllSpecialties(_: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const specialties = await specialtiesDB.getAllSpecialties();
    res.status(200).json(specialties);
  } catch (err) {
    next(err);
  }
}

export default {
  getAllSpecialties,
};
