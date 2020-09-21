import { Request, Response, NextFunction } from 'express';

function isAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.session) throw new Error('req.session is undefined');

  if (req.session.user === undefined) {
    console.log('isAdmin: user not authenticated');
    res.status(401).end();
    return;
  }

  if (req.session.user.role !== 'admin') {
    console.log('isAdmin: user not authorized');
    res.status(403).end();
    return;
  }

  next();
}

export default isAdmin;
