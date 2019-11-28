import { Request, Response, NextFunction } from 'express';

function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
  if (!req.session) throw new Error('req.session is undefined');

  if (req.session.account === undefined) {
    res.status(401).send('Unauthorized');
    return;
  }

  next();
}

export default isAuthenticated;
