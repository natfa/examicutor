import { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';

import { TimeOld } from '../models/Time';
import { ExamCreationFilterOld } from '../models/ExamCreationFilter';
import { ExamGradeBoundaryOld } from '../models/ExamGradeBoundary';

import { possibleGrades, pointValues } from '../constants';

interface ExamValidationResult {
  name?: string;
  startDate?: string;
  endDate?: string;
  timeToSolve?: string;
  filters?: string;
  boundaries?: string;
}

function validateName(name: string): ExamValidationResult {
  if (typeof name !== 'string') return { name: 'Must be a string' };
  if (name.length <= 2) return { name: 'Must be at least 3 characters long' };

  return {};
}

function validateTimeToSolve(timeToSolve: TimeOld): ExamValidationResult {
  if (typeof timeToSolve !== 'object') return { timeToSolve: 'Must be an object' };

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

function validateDates(start: string, end: string, timeToSolve: TimeOld): ExamValidationResult {
  let errors: ExamValidationResult = {};
  const timeToSolveErrors = validateTimeToSolve(timeToSolve);

  errors = { ...timeToSolveErrors };

  const startDate = dayjs(start);
  const endDate = dayjs(end);

  if (typeof start !== 'string' || !startDate.isValid()) {
    errors = { ...errors, startDate: 'Must be a valid date string' };
  }
  if (typeof end !== 'string' || !endDate.isValid()) {
    errors = { ...errors, endDate: 'Must be a valid date string' };
  }

  return errors;
}

function validateFilters(filters: ExamCreationFilterOld[]): ExamValidationResult {
  if (!Array.isArray(filters)) return { filters: 'Must be an array of filters' };
  if (filters.length === 0) return { filters: 'Can\'t be empty' };

  let errors: ExamValidationResult = {};

  filters.some((filter) => {
    if (
      !Object.prototype.hasOwnProperty.call(filter, 'subject')
      || !Object.prototype.hasOwnProperty.call(filter, 'themeFilters')
    ) {
      errors = { filters: 'Each filter must have a subject and theme filters properties' };
      return true;
    }

    if (
      !(Object.prototype.hasOwnProperty.call(filter.subject, 'id')
        && typeof filter.subject.id === 'string')
      || !(Object.prototype.hasOwnProperty.call(filter.subject, 'name')
        && typeof filter.subject.name === 'string')
    ) {
      errors = { filters: 'Each filter subject must be a valid subject object' };
      return true;
    }

    if (!Array.isArray(filter.themeFilters)) {
      errors = { filters: 'Theme filters must be an array' };
      return true;
    }

    if (filter.themeFilters.length === 0) {
      errors = { filters: 'Theme filters can\'t be empty' };
      return true;
    }

    const themeFilterErorrs = filter.themeFilters.some((themeFilter) => {
      if (!Object.prototype.hasOwnProperty.call(themeFilter, 'theme')) {
        errors = { filters: 'Each themeFilter must have a theme property' };
        return true;
      }

      if (
        !(Object.prototype.hasOwnProperty.call(themeFilter.theme, 'id')
          && typeof themeFilter.theme.id === 'string')
        || !(Object.prototype.hasOwnProperty.call(themeFilter.theme, 'name')
          && typeof themeFilter.theme.name === 'string')
      ) {
        errors = { filters: 'Each theme must be a valid theme object' };
        return true;
      }

      const themeFilterPropErrors = pointValues.some((grade) => {
        if (!Object.prototype.hasOwnProperty.call(themeFilter, grade)) {
          errors = { filters: 'Each theme filter must have `point: question count` values' };
          return true;
        }

        return false;
      });

      if (themeFilterPropErrors) return true;

      return false;
    });

    if (themeFilterErorrs) return true;

    return false;
  });

  return errors;
}

function validateBoundaries(boundaries: ExamGradeBoundaryOld[]): ExamValidationResult {
  if (!Array.isArray(boundaries)) return { boundaries: 'Must be an array' };
  if (boundaries.length === 0) return { boundaries: 'There must be at least one element' };

  let errors: ExamValidationResult = {};

  // will return as soon as an error is found
  boundaries.some((boundary) => {
    if (!Object.prototype.hasOwnProperty.call(boundary, 'specialty')) {
      errors = { boundaries: 'Each boundary must have a specialty property' };
      return true;
    }

    if (
      !Object.prototype.hasOwnProperty.call(boundary.specialty, 'id')
      || !Object.prototype.hasOwnProperty.call(boundary.specialty, 'name')
    ) {
      errors = { boundaries: 'Each specialty must have `id` and `name` properties' };
      return true;
    }

    const gradePropsError = possibleGrades.some((grade) => {
      // skip this grade
      if (grade === 2) return false;

      if (!Object.prototype.hasOwnProperty.call(boundary, grade)) {
        errors = { boundaries: 'Each specialty must have `grade: points required` values' };
        return true;
      }
      return false;
    });

    if (gradePropsError) return true;

    return false;
  });

  return errors;
}

function validateExamRequestBody(req: Request, res: Response, next: NextFunction): void {
  const {
    name,
    startDate,
    endDate,
    timeToSolve,
    filters,
    boundaries,
  } = req.body;

  let errors: ExamValidationResult = {};

  if (name === undefined) {
    errors = { ...errors, name: 'Required' };
  } else {
    const nameErrors = validateName(name);
    errors = { ...errors, ...nameErrors };
  }

  if (startDate === undefined) {
    errors = { ...errors, startDate: 'Required' };
  } else if (endDate === undefined) {
    errors = { ...errors, endDate: 'Required' };
  } else if (timeToSolve === undefined) {
    errors = { ...errors, timeToSolve: 'Required' };
  } else {
    const datesErrors = validateDates(startDate, endDate, timeToSolve);
    errors = { ...errors, ...datesErrors };
  }

  if (filters === undefined) {
    errors = { ...errors, filters: 'Required' };
  } else {
    const filtersErorrs = validateFilters(filters);
    errors = { ...errors, ...filtersErorrs };
  }

  if (boundaries === undefined) {
    errors = { ...errors, boundaries: 'Required' };
  } else {
    const boundariesErrors = validateBoundaries(boundaries);
    errors = { ...errors, ...boundariesErrors };
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json(errors);
    return;
  }

  next();
}

export default validateExamRequestBody;
