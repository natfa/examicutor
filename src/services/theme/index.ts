import { Request, Response, NextFunction } from 'express';

import themedb from '../../db/themes';

async function getThemesBySubjectId(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const themes = await themedb.getManyBySubjectid(req.params.subjectid);
    res.status(200).send(themes);
  } catch (err) {
    next(err);
  }
};

export default {
  getThemesBySubjectId,
}
