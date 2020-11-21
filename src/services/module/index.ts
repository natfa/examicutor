import { Request, Response, NextFunction } from 'express';

import { Module } from '../../models/Module';

async function getModules(_: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subjects = await Module.findAll();
    res.status(200).send(subjects);
  } catch (err) {
    next(err);
  }
};

export default {
  getModules,
}
