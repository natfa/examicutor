import express, { Request, Response, NextFunction} from 'express';
import multer from 'multer';
import path from 'path';
import fsCallbacks from 'fs';
// es6 imports don't support equivalent syntax to
// `const fs = require('fs').promises` yet
const fs = fsCallbacks.promises;

import { validateQuestionBody, validateFilters } from '../validators/question'
import { isAuthenticated } from '../middleware/isAuthenticated'
import removeUploadedFiles from '../utils/removeUploadedFiles';

import questiondb from '../db/questions'
import subjectdb from '../db/subjects'
import themedb from '../db/themes'

import Question from '../models/Question'
import Answer from '../models/Answer'
import Theme from '../models/Theme'
import Subject from '../models/Subject'


const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questions = await questiondb.getMany(100)
    return res.status(200).send(questions)
  }
  catch(err) {
    next(err)
  }
}

const getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const question = await questiondb.getOneById(req.params.id)

    if (question === null)
      return res.status(404).send('Not Found')
    return res.status(200).send(question)
  }
  catch(err) {
    next(err)
  }
}

const getQuestionsByFilter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectid, text } = req.params

    const questions = await questiondb.getManyBySubjectid(subjectid)
    return res.status(200).send(questions)
  }
  catch(err) {
    next(err)
  }
}

const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  // TODO: maybe change that to a full path and store it in the config file?
  const uploadsDir = path.resolve('uploads');
  const {
    text,
    points,
    subjectName,
    themeName,
    correctAnswers,
    incorrectAnswers
  } = req.body;

  // build media field
  const filenames = (req.files as Express.Multer.File[])
    .map((file: Express.Multer.File) => file.filename);

  const readFilePromises = filenames.map((filename: string) => {
    return fs.readFile(path.resolve(uploadsDir, filename));
  });

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
    return next(err);
  }

  // clean up files
  removeUploadedFiles(...filenames);

  // save subject and theme if nessessary
  if (!subjectFound) {
    try {
      subjectFound = await subjectdb.saveOne(new Subject(null, subjectName));
      themeFound = await themedb.saveOne(new Theme(null, themeName, subjectFound.id!));
    } catch (err) {
      return next(err);
    }
  } else if (!themeFound) {
    try {
      themeFound = await themedb.saveOne(new Theme(null, themeName, subjectFound.id!));
    } catch (err) {
      return next(err);
    }
  }


  // build answers
  const answers = [
    ...correctAnswers.map((answer: string) => ({ text: answer, correct: true })),
    ...incorrectAnswers.map((answer: string) => ({ text: answer, correct: false})),
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
    return next(err);
  }

  const responseData = {
    id: question.id,
    text: question.text,
    points: question.points,
    subjectName: question.subject.name,
    themeName: question.theme.name,
  };

  return res.status(200).json(responseData);
}

const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const success = await questiondb.deleteOneById(id)
    if (!success)
      return res.status(404).end();
    return res.status(204).end();
  }
  catch(err) {
    next(err)
  }
}

const router = express.Router()
const upload = multer({ dest: 'uploads/' });

router.use(isAuthenticated)

router.get('/', getQuestions)
router.get('/:id', getQuestionById)
router.get('/filter/:subjectid/:text?', validateFilters, getQuestionsByFilter)
router.post('/', upload.array('media'), validateQuestionBody, createQuestion)
router.delete('/:id', deleteQuestion)

export default router
