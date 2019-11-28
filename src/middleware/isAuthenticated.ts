import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session) throw new Error('req.session is undefined');

  if (!req.session.isAuthenticated) {
    res.status(401).send('Unauthorized');
    return;
  }

  next();
};

export default isAuthenticated;
