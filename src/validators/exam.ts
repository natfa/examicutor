import { Request, Response, NextFunction } from 'express';

import { Time } from '../models/Time';
import { ExamCreationFilter } from '../models/ExamCreationFilter';

interface ExamValidationResult {
  name?: string;
  date?: string;
  timeToSolve?: string;
  filters?: string;
}

function validateName(name: string): ExamValidationResult {
  let errors: ExamValidationResult = {};

  if (typeof name !== 'string') {
    errors = {
      ...errors,
      name: 'Must be a string',
    };
  } else if (name.length <= 2) {
    errors = {
      ...errors,
      name: 'Must be at least 3 characters long',
    };
  }

  return errors;
}

function validateDate(date: string): ExamValidationResult {
  let errors: ExamValidationResult = {};

  if (typeof date !== 'string') {
    errors = {
      ...errors,
      date: 'Must be a date string',
    };
  } else {
    const dateobj = new Date(date);

    if (dateobj.toString() === 'Invalid Date') {
      errors = {
        ...errors,
        date: 'Must be a valid date string',
      };
    }
  }

  return errors;
}

function validateTimeToSolve(timeToSolve: Time): ExamValidationResult {
  let errors: ExamValidationResult = {};

  if (typeof timeToSolve !== 'object') {
    errors = {
      timeToSolve: 'Must be an object',
    };
    return errors;
  }

  if (
    !Object.prototype.hasOwnProperty.call(timeToSolve, 'hours')
    || !Object.prototype.hasOwnProperty.call(timeToSolve, 'minutes')
  ) {
    errors = {
      timeToSolve: 'hours and minutes must be present as properties',
    };
  } else if (
    typeof timeToSolve.hours !== 'number'
    || typeof timeToSolve.minutes !== 'number'
  ) {
    errors = {
      timeToSolve: 'hours and minutes must be numbers',
    };
  }

  return errors;
}

function validateFilters(filters: ExamCreationFilter[]): ExamValidationResult {
  let errors: ExamValidationResult = {};

  if (!Array.isArray(filters)) {
    errors = {
      filters: 'Must be an array of filters',
    };
    return errors;
  }

  if (filters.length === 0) {
    errors = {
      filters: 'Can\'t be empty',
    };
    return errors;
  }

  filters.forEach((filter) => {
    if (
      !Object.prototype.hasOwnProperty.call(filter, 'subject')
      || !Object.prototype.hasOwnProperty.call(filter, 'themeFilters')
    ) {
      errors = {
        filters: 'Each filter must have a subject and theme filters properties',
      };
      return;
    }

    if (
      !(
        Object.prototype.hasOwnProperty.call(filter.subject, 'id')
        && typeof filter.subject.id === 'string'
      )
      || !(
        Object.prototype.hasOwnProperty.call(filter.subject, 'name')
        && typeof filter.subject.name === 'string'
      )
    ) {
      errors = {
        filters: 'Each filter subject must be a valid subject object',
      };
      return;
    }

    if (!Array.isArray(filter.themeFilters)) {
      errors = {
        filters: 'Theme filters must be an array',
      };
      return;
    }

    if (filter.themeFilters.length === 0) {
      errors = {
        filters: 'Theme filters can\'t be empty',
      };
      return;
    }

    // This validation could be improved...
    filter.themeFilters.forEach((themeFilter) => {
      if (
        !Object.prototype.hasOwnProperty.call(themeFilter, 'theme')
        || !Object.prototype.hasOwnProperty.call(themeFilter, 1)
        || !Object.prototype.hasOwnProperty.call(themeFilter, 2)
        || !Object.prototype.hasOwnProperty.call(themeFilter, 3)
        || !Object.prototype.hasOwnProperty.call(themeFilter, 4)
        || !Object.prototype.hasOwnProperty.call(themeFilter, 5)
      ) {
        errors = {
          filters: 'Each theme filter must have a theme and `point value`: `question count` values',
        };
      }
    });
  });

  return errors;
}

export function validateExamRequestBody(req: Request, res: Response, next: NextFunction): void {
  let errors: ExamValidationResult = {};

  const {
    name,
    startDate,
    endDate,
    timeToSolve,
    filters,
  } = req.body;

  if (name === undefined) {
    errors = {
      ...errors,
      name: 'Required',
    };
  } else {
    const nameErrors = validateName(name);
    errors = {
      ...errors,
      ...nameErrors,
    };
  }

  if (startDate === undefined) {
    errors = {
      ...errors,
      date: 'Required',
    };
  } else {
    const startDateErrors = validateDate(startDate);
    errors = {
      ...errors,
      ...startDateErrors,
    };
  }

  if (endDate === undefined) {
    errors = {
      ...errors,
      date: 'Required',
    };
  } else {
    const endDateErrors = validateDate(endDate);
    errors = {
      ...errors,
      ...endDateErrors,
    };
  }

  if (timeToSolve === undefined) {
    errors = {
      ...errors,
      timeToSolve: 'Required',
    };
  } else {
    const timeToSolveErrors = validateTimeToSolve(timeToSolve);
    errors = {
      ...errors,
      ...timeToSolveErrors,
    };
  }

  if (filters === undefined) {
    errors = {
      ...errors,
      filters: 'Required',
    };
  } else {
    const filtersErorrs = validateFilters(filters);
    errors = {
      ...errors,
      ...filtersErorrs,
    };
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json(errors);
    return;
  }

  next();
}

export default {
  validateExamRequestBody,
};
