import { Request, Response, NextFunction } from 'express';

import { db } from '../../models';

async function getModules(_: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subjects = await db.Module.findAll();
    res.status(200).send(subjects);
  } catch (err) {
    next(err);
  }
};

export default {
  getModules,
}
