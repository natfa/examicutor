import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session) throw new Error('req.session is undefined');

  if (!req.session.account.roles.includes('admin')) {
    res.status(403).send('Forbidden');
    return;
  }

  next();
};

export default isAdmin;
