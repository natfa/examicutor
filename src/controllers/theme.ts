import express, { Request, Response, NextFunction } from 'express';

import { isAuthenticated } from '../middleware/isAuthenticated';

import themedb from '../db/themes';


const getAllThemes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const themes = await themedb.getAll();
    res.status(200).send(themes);
  } catch (err) {
    next(err);
  }
};

const getThemesFromSubject = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const themes = await themedb.getManyBySubjectid(req.params.subjectid);
    res.status(200).send(themes);
  } catch (err) {
    next(err);
  }
};

const router = express.Router();

router.use(isAuthenticated);

router.get('/', getAllThemes);
router.get('/:subjectid', getThemesFromSubject);

export default router;
