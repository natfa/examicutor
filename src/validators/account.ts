import { Request, Response, NextFunction } from 'express';

import isEmail from '../utils/isEmail';

import { roles as definedRoles } from '../constants';

interface AccountValidationResult {
  email?: string;
  password?: string;
  roles?: string;
}

export function validateEmail(email: string): AccountValidationResult {
  if (typeof email !== 'string') return { email: 'Must be a string' };
  if (!isEmail(email)) return { email: 'Must be a valid email' };

  return {};
}

export function validatePassword(password: string): AccountValidationResult {
  if (typeof password !== 'string') return { password: 'Must be a string' };
  return {};
}

function validateRoles(roles: string[]): AccountValidationResult {
  if (!Array.isArray(roles)) return { roles: 'Must be an array' };

  let errors: AccountValidationResult = {};

  roles.some((role) => {
    if (typeof role !== 'string' || !definedRoles.includes(role)) {
      errors = {
        roles: `A role should be one of the following: ${definedRoles.join(',')} `,
      };
      return true;
    }
    return false;
  });

  return errors;
}

function validateAccountBody(req: Request, res: Response, next: NextFunction): void {
  const { email, password, roles } = req.body;
  let errors: AccountValidationResult = {};

  if (email === undefined) {
    errors = { ...errors, email: 'Required' };
  } else {
    const emailErrors = validateEmail(email);
    errors = { ...errors, ...emailErrors };
  }

  if (password === undefined) {
    errors = { ...errors, password: 'Required' };
  } else {
    const passwordErrors = validatePassword(password);
    errors = { ...errors, ...passwordErrors };
  }

  if (roles === undefined) {
    errors = { ...errors, roles: 'Required' };
  } else {
    const rolesErrors = validateRoles(roles);
    errors = { ...errors, ...rolesErrors };
  }

  if (Object.keys(errors).length !== 0) {
    res.status(400).send(errors);
    return;
  }
  next();
}

export default validateAccountBody;
