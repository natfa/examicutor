import { Request, Response, NextFunction } from 'express';

function isTeacher(req: Request, res: Response, next: NextFunction): void {
  if (!req.session) throw new Error('req.session is undefined');

  if (req.session.account === undefined) {
    res.status(401).end();
    return;
  }

  if (!req.session.account.roles.includes('teacher')) {
    res.status(403).end();
    return;
  }

  next();
}

export default isTeacher;
