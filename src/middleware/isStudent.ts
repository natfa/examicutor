import { Request, Response, NextFunction } from 'express';

/** Checks if the authenticated user is an admin or a student and calls the next middleware
 */
function isStudent(req: Request, res: Response, next: NextFunction): void {
  if (!req.session) throw new Error('req.session is undefined');

  // if not authenticated
  if (req.session.account === undefined) {
    res.status(401).end();
    return;
  }

  if (
    req.session.account.roles.includes('admin')
    || req.session.account.roles.includes('student')
  ) {
    next();
    return;
  }

  res.status(403).end();
}

export default isStudent;
