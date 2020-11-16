import { Request, Response, NextFunction } from 'express';

import { Theme } from '../../models/Theme';

async function getThemesBySubjectId(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { subjectid } = req.params;

    const themes = await Theme.findAll({
      where: {
        subjectId: subjectid,
      },
    });

    res.status(200).send(themes);
  } catch (err) {
    next(err);
  }
};

export default {
  getThemesBySubjectId,
}
