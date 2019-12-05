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
  if (typeof text !== 'string') return { text: 'Must be a string' };
  if (text.length > 500) return { text: 'Max length: 500' };
  if (text.length <= 2) return { text: 'Min length: 2' };

  return {};
}

function validateAnswers(answers: Array<string>): QuestionValidationResult {
  if (!Array.isArray(answers)) return { answers: 'Must be an array' };
  if (answers.length === 0) return { answers: 'At least 1 correct and 1 incorrect answers are required' };


  let errors: QuestionValidationResult = {};

  answers.some((answer) => {
    if (typeof answer !== 'string') {
      errors = { answers: 'All answers must be strings' };
      return true;
    }

    return false;
  });

  return errors;
}

function validatePoints(points: number): QuestionValidationResult {
  if (typeof points !== 'number' && !Number.isNaN(points)) return { points: 'Must be a number' };
  if (points < 0) return { points: 'Can\'t be negative' };

  return {};
}

function validateSubjectName(subjectName: string): QuestionValidationResult {
  if (typeof subjectName !== 'string') return { subjectName: 'Must be a string' };

  return {};
}

function validateThemeName(themeName: string): QuestionValidationResult {
  if (typeof themeName !== 'string') return { themeName: 'Must be a string' };

  return {};
}

function validateQuestionBody(req: Request, res: Response, next: NextFunction): void {
  const {
    text,
    points,
    subjectName,
    themeName,
    correctAnswers,
    incorrectAnswers,
  } = req.body;

  let errors: QuestionValidationResult = {};

  if (text === undefined) {
    errors = { ...errors, text: 'Required' };
  } else {
    const textErrors = validateText(text);
    errors = { ...errors, ...textErrors };
  }

  if (points === undefined) {
    errors = { ...errors, points: 'Required' };
  } else {
    const pointsErrors = validatePoints(Number(points));
    errors = { ...errors, ...pointsErrors };
  }

  if (incorrectAnswers === undefined) {
    errors = { ...errors, incorrectAnswers: 'Required' };
  } else {
    const incorrectAnswersErrors = validateAnswers(incorrectAnswers);
    errors = { ...errors, ...incorrectAnswersErrors };
  }

  if (correctAnswers === undefined) {
    errors = { ...errors, correctAnswers: 'Required' };
  } else {
    const correctAnswersErrors = validateAnswers(correctAnswers);
    errors = { ...errors, ...correctAnswersErrors };
  }

  if (subjectName === undefined) {
    errors = { ...errors, subjectName: 'Required' };
  } else {
    const subjectNameErrors = validateSubjectName(subjectName);
    errors = { ...errors, ...subjectNameErrors };
  }

  if (themeName === undefined) {
    errors = { ...errors, themeName: 'Required' };
  } else {
    const themeNameErrors = validateThemeName(themeName);
    errors = { ...errors, ...themeNameErrors };
  }

  if (Object.keys(errors).length > 0) {
    // cleanup unused files
    const filenames = (req.files as Express.Multer.File[])
      .map((file) => file.filename);

    removeUploadedFiles(...filenames);

    res.status(400).send(errors);
    return;
  }

  next();
}

export default validateQuestionBody;
