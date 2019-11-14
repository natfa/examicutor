import { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';

import { Time } from '../models/Time';
import { ExamCreationFilter } from '../models/ExamCreationFilter';

interface ExamValidationResult {
  name?: string;
  startDate?: string;
  endDate?: string;
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

function validateTimeToSolve(timeToSolve: Time): ExamValidationResult {
  if (typeof timeToSolve !== 'object') {
    return { timeToSolve: 'Must be an object' };
  }

  if (
    !Object.prototype.hasOwnProperty.call(timeToSolve, 'hours')
    || !Object.prototype.hasOwnProperty.call(timeToSolve, 'minutes')
  ) {
    return { timeToSolve: 'Hours and minutes must be present as properties' };
  }
  if (
    typeof timeToSolve.hours !== 'number'
    || typeof timeToSolve.minutes !== 'number'
  ) {
    return { timeToSolve: 'hours and minutes must be numbers' };
  }

  return {};
}

function validateDates(start: string, end: string, timeToSolve: Time): ExamValidationResult {
  const timeToSolveErrors = validateTimeToSolve(timeToSolve);

  if (Object.keys(timeToSolveErrors).length > 0) {
    return timeToSolveErrors;
  }

  const now = dayjs();
  const startDate = dayjs(start);
  const endDate = dayjs(end);

  if (typeof start !== 'string' || !startDate.isValid()) {
    return { startDate: 'Must be a valid date string' };
  }
  if (typeof end !== 'string' || !endDate.isValid()) {
    return { endDate: 'Must be a valid date string' };
  }

  if (startDate.isBefore(now)) {
    return { startDate: 'Must be after current date' };
  }
  if (endDate.isBefore(startDate)) {
    return { endDate: 'Must be after startDate' };
  }

  const startDateAfterSolving = startDate
    .add(timeToSolve.hours, 'hour')
    .add(timeToSolve.minutes, 'minute');

  if (startDateAfterSolving.isAfter(endDate)) {
    return { endDate: 'You must give enough time to the students to solve the exam' };
  }

  return {};
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
      startDate: 'Required',
    };
  } else if (endDate === undefined) {
    errors = {
      ...errors,
      endDate: 'Required',
    };
  } else if (timeToSolve === undefined) {
    errors = {
      ...errors,
      timeToSolve: 'Required',
    };
  } else {
    const datesErrors = validateDates(startDate, endDate, timeToSolve);
    errors = {
      ...errors,
      ...datesErrors,
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
