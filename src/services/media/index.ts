import { Request, Response, NextFunction } from 'express';

import mediadb from '../../db/media';

async function getMediaByQuestionId(req: Request, res: Response, next: NextFunction,): Promise<void> {
  const { questionId } = req.params;

  try {
    const buffers = await mediadb.getManyByQuestionId(questionId);
    res.status(200).send(buffers);
  } catch (err) {
    next(err);
  }
};

export default {
  getMediaByQuestionId,
}
