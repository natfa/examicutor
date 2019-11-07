import { Request, Response, NextFunction } from 'express';

interface AccountValidationResult {
  email?: string;
  password?: string;
  isAdmin?: string;
}

function isEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validateEmail(email: string): AccountValidationResult {
  let errors: AccountValidationResult = {};

  if (typeof email !== 'string') {
    errors = {
      ...errors,
      email: 'Must be a string',
    };
  } else if (email.length === 0) {
    errors = {
      ...errors,
      email: 'Can\'t be empty',
    };
  } else if (email.length >= 50 || !isEmail(email)) {
    errors = {
      ...errors,
      email: 'Please provide a valid email',
    };
  }

  return errors;
}

export function validatePassword(password: string): AccountValidationResult {
  let errors: AccountValidationResult = {};

  if (typeof password !== 'string') {
    errors = {
      ...errors,
      password: 'Must be a string',
    };
  } else if (password.length === 0) {
    errors = {
      ...errors,
      password: 'Can\'t be empty',
    };
  }

  return errors;
}

function validateIsAdmin(isAdmin: boolean): AccountValidationResult {
  let errors: AccountValidationResult = {};

  if (typeof isAdmin !== 'boolean') {
    errors = {
      ...errors,
      isAdmin: 'Must be a boolean',
    };
  }

  return errors;
}


export function validateAccountBody(req: Request, res: Response, next: NextFunction): void {
  let errors: AccountValidationResult = {};
  const { email, password, isAdmin } = req.body;

  if (email === undefined) {
    errors = {
      ...errors,
      email: 'Required',
    };
  } else {
    const emailErrors = validateEmail(email);
    errors = {
      ...errors,
      ...emailErrors,
    };
  }

  if (password === undefined) {
    errors = {
      ...errors,
      password: 'Required',
    };
  } else {
    const passwordErrors = validatePassword(password);
    errors = {
      ...errors,
      ...passwordErrors,
    };
  }

  if (isAdmin !== undefined) {
    const isAdminErrors = validateIsAdmin(isAdmin);
    errors = {
      ...errors,
      ...isAdminErrors,
    };
  }

  if (Object.keys(errors).length !== 0) {
    res.status(400).send(errors);
    return;
  }
  next();
}

export default validateAccountBody;
