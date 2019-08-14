import { Request, Response, NextFunction } from 'express';

export default function (req: Request, res: Response, next: NextFunction) {
  if (!req.session)
    return res.status(500).send(`There's something wrong with sessions, please try again later.`);

  // Not authenticated, redirect
  if (!req.session.isAuthenticated)
    return res.status(300).send('Not authenticaed, please log in first');

  // User is authenticated, proceed
  next();
}
