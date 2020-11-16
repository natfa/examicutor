import { Request, Response, NextFunction } from 'express';

/**
 * Check if the authenticated account is a teacher and calls the next middleware
 */
function isTeacher(req: Request, res: Response, next: NextFunction): void {
  if (!req.session) throw new Error('req.session is undefined');

  if (req.session.user === undefined) {
    res.status(401).end();
    return;
  }

  if (req.session.user.role === 'teacher') {
    res.status(403).end();
    return;
  }

  next();
}

export default isTeacher;
