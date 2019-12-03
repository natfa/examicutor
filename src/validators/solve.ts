import { Request, Response, NextFunction } from 'express';

export function validateSaveAnswerBody(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { questionId, answerId } = req.body;

  if (questionId === undefined || typeof questionId !== 'string') {
    res.status(400).send({ questionId: 'Must be a string' });
    return;
  }

  if (answerId === undefined || typeof answerId !== 'string') {
    res.status(400).send({ answerId: 'Must be a string' });
    return;
  }

  next();
}

export default {
  validateSaveAnswerBody,
};
