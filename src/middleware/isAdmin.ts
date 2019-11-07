import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session) {
    next(new Error('req.session is undefined'));
    return;
  }

  if (!req.session.account.isAdmin) {
    res.status(403).send('Forbidden');
    return;
  }

  next();
};

export default isAdmin;
