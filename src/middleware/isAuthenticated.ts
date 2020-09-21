import { Request, Response, NextFunction } from 'express';

export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
  if (!req.session) throw new Error('req.session is undefined');

  if (req.session.user === undefined) {
    res.status(401).send('Unauthenticated');
    return;
  }

  next();
}

export default isAuthenticated;
