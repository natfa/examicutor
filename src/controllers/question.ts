import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fsCallbacks from 'fs';

import { validateQuestionBody, validateFilters } from '../validators/question';
import { isAuthenticated } from '../middleware/isAuthenticated';
import removeUploadedFiles from '../utils/removeUploadedFiles';

import questiondb from '../db/questions';
import subjectdb from '../db/subjects';
import themedb from '../db/themes';

import Question from '../models/Question';
import Theme from '../models/Theme';
import Subject from '../models/Subject';

// es6 imports don't support equivalent syntax to
// `const fs = require('fs').promises` yet
const fs = fsCallbacks.promises;

const getQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const questions = await questiondb.getMany(100);
    res.status(200).send(questions);
  } catch (err) {
    next(err);
  }
};

const getQuestionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const question = await questiondb.getOneById(req.params.id);

    if (question === null) {
      res.status(404).send('Not Found');
      return;
    }
    res.status(200).send(question);
  } catch (err) {
    next(err);
  }
};

const getQuestionsByFilter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { subjectid } = req.params;

    const questions = await questiondb.getManyBySubjectid(subjectid);
    res.status(200).send(questions);
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
      subjectFound = await subjectdb.saveOne(new Subject(null, subjectName));
      if (!subjectFound.id) throw Error('subject id is null|undefined');
      themeFound = await themedb.saveOne(new Theme(null, themeName, subjectFound.id));
    } catch (err) {
      next(err);
      return;
    }
  } else if (!themeFound) {
    try {
      if (!subjectFound.id) throw Error('subject id is null|undefined');
      themeFound = await themedb.saveOne(new Theme(null, themeName, subjectFound.id));
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

  let question = new Question(
    null,
    text,
    answers,
    Number(points),
    subjectFound,
    themeFound,
    media,
  );

  try {
    question = await questiondb.saveOne(question);
  } catch (err) {
    next(err);
    return;
  }

  const responseData = {
    id: question.id,
    text: question.text,
    points: question.points,
    subject: question.subject,
    theme: question.theme,
  };

  res.status(200).json(responseData);
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
router.get('/filter/:subjectid/:text?', validateFilters, getQuestionsByFilter);
router.post('/', upload.array('media'), validateQuestionBody, createQuestion);
router.delete('/:id', deleteQuestion);

export default router;
