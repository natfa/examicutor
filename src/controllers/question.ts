import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fsCallbacks from 'fs';

import { validateQuestionBody, validateFilters } from '../validators/question';
import { isAuthenticated } from '../middleware/isAuthenticated';
import removeUploadedFiles from '../utils/removeUploadedFiles';

import mediadb from '../db/media';
import questiondb from '../db/questions';
import subjectdb from '../db/subjects';
import themedb from '../db/themes';

import { Answer } from '../models/Answer';
import { Question } from '../models/Question';
import { Theme } from '../models/Theme';
import { Subject } from '../models/Subject';

// es6 imports don't support equivalent syntax to
// `const fs = require('fs').promises` yet
const fs = fsCallbacks.promises;

interface QuestionRequestBody {
  id?: string;
  text: string;
  points: string;
  subject: Subject;
  theme: Theme;
  correctAnswers: string[];
  incorrectAnswers: string[];
}

const getQuestions = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const questions = await questiondb.getMany(200);
    res.status(200).json(questions);
  } catch (err) {
    next(err);
  }
};

const getQuestionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const question = await questiondb.getOneById(id);

    if (question === null) {
      res.status(404).end();
      return;
    }
    res.status(200).json(question);
  } catch (err) {
    next(err);
  }
};

const getQuestionsByFilter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { subjectid } = req.params;

  try {
    const questions = await questiondb.getManyBySubjectid(subjectid);

    res.status(200).json(questions);
  } catch (err) {
    next(err);
  }
};

const createQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // TODO: maybe change that to a full path and store it in the config file?
  const uploadsDir = path.resolve('uploads');
  const {
    text,
    points,
    subjectName,
    themeName,
    correctAnswers,
    incorrectAnswers,
  } = req.body;

  // build media field
  const filenames = (req.files as Express.Multer.File[])
    .map((file: Express.Multer.File) => file.filename);

  const readFilePromises = filenames
    .map((filename: string) => fs.readFile(path.resolve(uploadsDir, filename)));

  let media: Array<Buffer> = [];
  let subjectFound: Subject|null;
  let themeFound: Theme|null;

  try {
    // in this statement the media is being filled as an array
    // from the Promise.all([...readFilePromises]) promise
    // they still execute in paralel
    [subjectFound, themeFound, media] = await Promise.all([
      subjectdb.getOneByName(subjectName),
      themedb.getOneByName(themeName),
      Promise.all([...readFilePromises]),
    ]);
  } catch (err) {
    next(err);
    return;
  }

  // clean up files
  removeUploadedFiles(...filenames);

  // save subject and theme if nessessary
  if (!subjectFound) {
    try {
      subjectFound = await subjectdb.saveOne({ name: subjectName });
      themeFound = await themedb.saveOne({ name: themeName, subject: subjectFound });
    } catch (err) {
      next(err);
      return;
    }
  } else if (!themeFound) {
    try {
      themeFound = await themedb.saveOne({ name: themeName, subject: subjectFound });
    } catch (err) {
      next(err);
      return;
    }
  }

  // build answers
  const answers = [
    ...correctAnswers.map((answer: string) => ({ text: answer, correct: true })),
    ...incorrectAnswers.map((answer: string) => ({ text: answer, correct: false })),
  ];

  const question: Question = {
    text,
    answers,
    points: Number(points),
    subject: subjectFound,
    theme: themeFound,
  };

  try {
    const questionId = await questiondb.saveOne(question);
    const mediaInsertPromises = media.map((m) => mediadb.saveOne(m, questionId));

    await Promise.all(mediaInsertPromises);

    res.status(200).json({ questionId });
  } catch (err) {
    next(err);
  }
};

const ensureSubject = async (req: Request, _: Response, next: NextFunction): Promise<void> => {
  const { subjectName } = req.body;

  try {
    let subject = await subjectdb.getOneByName(subjectName);

    if (subject === null) {
      subject = await subjectdb.saveOne({ name: subjectName });
    }

    req.body.subject = subject;
    next();
  } catch (err) {
    next(err);
  }
};

const ensureTheme = async (req: Request, _: Response, next: NextFunction): Promise<void> => {
  const { themeName, subject } = req.body;

  try {
    let theme = await themedb.getOneByName(themeName);

    if (theme === null) {
      theme = await themedb.saveOne({ name: themeName, subject });
    }

    req.body.theme = theme;
    next();
  } catch (err) {
    next(err);
  }
};


const updateQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    id,
    text,
    points,
    subject,
    theme,
    correctAnswers,
    incorrectAnswers,
  } = req.body as QuestionRequestBody;

  // the only validation done in the controller
  if (typeof id !== 'string') {
    res.status(400).json({ id: 'Must be string' });
    return;
  }

  const answers: Answer[] = [
    ...correctAnswers.map((answer: string) => ({ text: answer, correct: true })),
    ...incorrectAnswers.map((answer: string) => ({ text: answer, correct: false })),
  ];

  const question: Question = {
    id,
    text,
    points: Number(points),
    subject,
    theme,
    answers,
  };

  try {
    const success = await questiondb.updateOne(question);

    if (!success) {
      next(new Error('Something went wrong'));
    }

    const uploadsDir = path.resolve('uploads');

    // build media field
    const filenames = (req.files as Express.Multer.File[])
      .map((file: Express.Multer.File) => file.filename);

    const readFilePromises = filenames
      .map((filename: string) => fs.readFile(path.resolve(uploadsDir, filename)));

    const media: Array<Buffer> = await Promise.all(readFilePromises);

    const mediaInsertPromises = media.map((m) => {
      if (question.id === undefined) {
        throw new Error('Question id is undefined!??!!??!?!?!?!?!?!?!');
      }
      return mediadb.saveOne(m, question.id);
    });

    // clean up files
    removeUploadedFiles(...filenames);
    await Promise.all(mediaInsertPromises);

    res.status(200).json(question);
  } catch (err) {
    next(err);
  }
};

const deleteQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const success = await questiondb.deleteOneById(id);
    if (!success) {
      res.status(404).end();
      return;
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(isAuthenticated);

router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.get('/filter/:subjectId/:text?', validateFilters, getQuestionsByFilter);
router.post('/', upload.array('media'), validateQuestionBody, createQuestion);
router.put('/', upload.array('media'), validateQuestionBody, ensureSubject, ensureTheme, updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;
