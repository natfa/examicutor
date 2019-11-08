import { Request, Response, NextFunction } from 'express';

import removeUploadedFiles from '../utils/removeUploadedFiles';

interface QuestionValidationResult {
  text?: string;
  points?: string;
  subjectName?: string;
  themeName?: string;

  answers?: string;
  correctAnswers?: string;
  incorrectAnswers?: string;
}

function validateText(text: string): QuestionValidationResult {
  let errors: QuestionValidationResult = {};

  if (typeof text !== 'string') {
    errors = {
      ...errors,
      text: 'Must be a string',
    };
  } else if (text.length > 500) {
    errors = {
      ...errors,
      text: 'Max length: 500',
    };
  } else if (text.length <= 2) {
    errors = {
      ...errors,
      text: 'Can\'t be less than 3 characters',
    };
  }
  return errors;
}

function validateAnswers(answers: Array<string>): QuestionValidationResult {
  let errors: QuestionValidationResult = {};

  if (!Array.isArray(answers)) {
    errors = {
      ...errors,
      answers: 'Must be an array',
    };
  } else if (answers.length === 0) {
    errors = {
      ...errors,
      answers: 'At least 1 correct and 1 incorrect answers are required',
    };
  } else {
    answers.forEach((answer) => {
      if (typeof answer !== 'string') {
        errors = {
          ...errors,
          answers: 'All answers must be strings',
        };
      }
    });
  }
  return errors;
}

function validatePoints(points: number): QuestionValidationResult {
  let errors: QuestionValidationResult = {};

  if (typeof points !== 'number' && !Number.isNaN(points)) {
    errors = {
      ...errors,
      points: 'Must be a number',
    };
  } else if (points < 0) {
    errors = {
      ...errors,
      points: 'Can\'t be negative',
    };
  }
  return errors;
}

function validateSubjectName(subjectName: string): QuestionValidationResult {
  let errors: QuestionValidationResult = {};

  if (typeof subjectName !== 'string') {
    errors = {
      ...errors,
      subjectName: 'Must be a string',
    };
  } else if (subjectName.length === 0) {
    errors = {
      ...errors,
      subjectName: 'Can\'t be empty',
    };
  }
  return errors;
}

function validateThemeName(themeName: string): QuestionValidationResult {
  let errors: QuestionValidationResult = {};

  if (typeof themeName !== 'string') {
    errors = {
      ...errors,
      themeName: 'Must be a string',
    };
  } else if (themeName.length === 0) {
    errors = {
      ...errors,
      themeName: 'Can\'t be empty',
    };
  }
  return errors;
}

export function validateFilters(req: Request, res: Response, next: NextFunction): void {
  let errors: QuestionValidationResult = {};
  const { subjectid, text } = req.params;

  if (subjectid === undefined) {
    errors = {
      ...errors,
      subjectName: 'Required',
    };
  } else {
    // Important: Since the subject id is a string (same as the name),
    // the check here uses the validateSubjectName function
    // which is meant to be used for the name.
    // If the ID of the subject model changes, there should be a new method created
    // that would handle this specific check
    const subjectIdErrors = validateSubjectName(subjectid);
    errors = {
      ...errors,
      ...subjectIdErrors,
    };
  }

  if (text !== undefined) {
    const textErrors = validateText(text);
    errors = {
      ...errors,
      ...textErrors,
    };
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).send(errors);
    return;
  }

  next();
}

export function validateQuestionBody(req: Request, res: Response, next: NextFunction): void {
  let errors: QuestionValidationResult = {};

  const {
    text,
    points,
    subjectName,
    themeName,
    correctAnswers,
    incorrectAnswers,
  } = req.body;

  if (text === undefined) {
    errors = {
      ...errors,
      text: 'Required',
    };
  } else {
    const textErrors = validateText(text);
    errors = {
      ...errors,
      ...textErrors,
    };
  }

  if (points === undefined) {
    errors = {
      ...errors,
      points: 'Required',
    };
  } else {
    const pointsErrors = validatePoints(Number(points));
    errors = {
      ...errors,
      ...pointsErrors,
    };
  }

  if (incorrectAnswers === undefined) {
    errors = {
      ...errors,
      incorrectAnswers: 'Required',
    };
  } else {
    const incorrectAnswersErrors = validateAnswers(incorrectAnswers);
    errors = {
      ...errors,
      ...incorrectAnswersErrors,
    };
  }

  if (correctAnswers === undefined) {
    errors = {
      ...errors,
      correctAnswers: 'Required',
    };
  } else {
    const correctAnswersErrors = validateAnswers(correctAnswers);
    errors = {
      ...errors,
      ...correctAnswersErrors,
    };
  }

  if (subjectName === undefined) {
    errors = {
      ...errors,
      subjectName: 'Required',
    };
  } else {
    const subjectNameErrors = validateSubjectName(subjectName);
    errors = {
      ...errors,
      ...subjectNameErrors,
    };
  }

  if (themeName === undefined) {
    errors = {
      ...errors,
      themeName: 'Required',
    };
  } else {
    const themeNameErrors = validateThemeName(themeName);
    errors = {
      ...errors,
      ...themeNameErrors,
    };
  }

  if (Object.keys(errors).length > 0) {
    // cleanup
    const filenames = (req.files as Express.Multer.File[])
      .map((file) => file.filename);
    removeUploadedFiles(...filenames);

    res.status(400).send(errors);
    return;
  }
  next();
}
