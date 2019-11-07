import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session) {
    next(new Error('req.session is undefined'));
    return;
  }

  if (!req.session.isAuthenticated) {
    res.status(401).send('Unauthorized');
    return;
  }
  next();
};

export default isAuthenticated;
