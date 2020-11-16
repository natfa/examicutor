import { Request, Response, NextFunction } from 'express';

/** Checks if the authenticated user is a student and calls the next middleware
 */
function isStudent(req: Request, res: Response, next: NextFunction): void {
  if (!req.session) throw new Error('req.session is undefined');

  // if not authenticated
  if (req.session.user === undefined) {
    res.status(401).end();
    return;
  }

  if (req.session.user.role !== 'student') {
    res.status(403).end();
    return;
  }

  next();
}

export default isStudent;
