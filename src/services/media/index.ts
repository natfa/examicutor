import { Request, Response, NextFunction } from 'express';

async function getMediaByQuestionId(req: Request, res: Response, next: NextFunction,): Promise<void> {
  res.status(500).send('Not implemented');
};

export default {
  getMediaByQuestionId,
}
