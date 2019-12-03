import { Request, Response, NextFunction } from 'express';

/**
 * Check if the authenticated account is an admin or a teacher and calls the next middleware
 */
function isTeacher(req: Request, res: Response, next: NextFunction): void {
  if (!req.session) throw new Error('req.session is undefined');

  if (req.session.account === undefined) {
    res.status(401).end();
    return;
  }

  if (
    req.session.account.roles.includes('admin')
    || req.session.account.roles.includes('teacher')
  ) {
    next();
    return;
  }

  res.status(403).end();
}

export default isTeacher;
