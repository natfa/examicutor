import { Request, Response, NextFunction } from 'express';
import { validateEmail, validatePassword } from './account';

function validateLoginCredentials(req: Request, res: Response, next: NextFunction): void {
  const { email, password } = req.body;
  let errors = {};

  if (email === undefined) {
    errors = { ...errors, email: 'Required' };
  } else {
    const emailErrors = validateEmail(email);
    errors = { ...errors, ...emailErrors };
  }

  if (password === undefined) {
    errors = { ...errors, password: 'Required' };
  } else {
    const passswordErrors = validatePassword(password);
    errors = { ...errors, ...passswordErrors };
  }

  if (Object.keys(errors).length !== 0) {
    res.status(400).send(errors);
    return;
  }
  next();
}

export default validateLoginCredentials;
