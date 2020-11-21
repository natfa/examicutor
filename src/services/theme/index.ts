import { Request, Response, NextFunction } from 'express';

import { Theme } from '../../models/Theme';

async function getThemesByModuleId(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { moduleId } = req.params;

    const themes = await Theme.findAll({
      where: {
        moduleId: moduleId,
      },
    });

    res.status(200).send(themes);
  } catch (err) {
    next(err);
  }
};

export default {
  getThemesByModuleId,
}
