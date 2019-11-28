import express, { Request, Response, NextFunction } from 'express';

import mediadb from '../db/media';

import isAuthenticated from '../middleware/isAuthenticated';

const getMediaByQuestionId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { questionId } = req.params;

  try {
    const buffers = await mediadb.getManyByQuestionId(questionId);
    res.status(200).send(buffers);
  } catch (err) {
    next(err);
  }
};

const router = express.Router();

router.use(isAuthenticated);

router.get('/:questionId', getMediaByQuestionId);

export default router;
