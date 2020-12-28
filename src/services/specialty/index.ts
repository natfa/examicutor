import { Request, Response, NextFunction } from 'express';

import { db } from '../../models';

async function getAllSpecialties(_: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const specialties = await db.Specialty.findAll();
    res.status(200).json(specialties);
  } catch (err) {
    next(err);
  }
}

export default {
  getAllSpecialties,
};
