import { Request, Response, NextFunction } from 'express';

const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const log = `[${req.method}] ${req.originalUrl}`;
  console.log(log);
  next();
};

export default requestLogger;
