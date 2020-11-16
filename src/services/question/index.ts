import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { promises as fs } from 'fs';

import removeUploadedFiles from '../../utils/removeUploadedFiles';

import { Question } from '../../models/Question';

import questiondb from '../../db/questions';
import subjectdb from '../../db/subjects';
import themedb from '../../db/themes';
import mediadb from '../../db/media';

import { AnswerOld } from '../../models/Answer';
import { QuestionOld } from '../../models/Question';
import { ThemeOld } from '../../models/Theme';
import { SubjectOld } from '../../models/Subject';

interface QuestionRequestBody {
  id?: string;
  text: string;
  points: string;
  subject: SubjectOld;
  theme: ThemeOld;
  correctAnswers: string[];
  incorrectAnswers: string[];
}

/**
 * Saves media files to the database
 * @param {string[]} filenames The filenames of the files to be read and saved as Buffers
 * @param {string} questionId The id of the question
 *
 * @returns {Promise<void>[]} The promises of the requests to the database to save the media
 */
const saveMedia = async (
  filenames: string[],
  questionId: string,
): Promise<Promise<void>[]> => {
  // TODO: maybe change that to a full path and store it in the config file?
  const uploadsDir = path.resolve('uploads');

  const readFiles = filenames.map((filename) => fs.readFile(path.resolve(uploadsDir, filename)));

  const buffers: Array<Buffer> = await Promise.all(readFiles);

  // start the saving promises
  return buffers.map((buffer) => mediadb.saveOne(buffer, questionId));
};

async function getQuestions(_: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const questions = await Question.findAll({ limit: 200 });
    res.status(200).json(questions);
  } catch (err) {
    next(err);
  }
}


async function getQuestionById(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;

  try {
    const question = await Question.findByPk(id);

    if (question === null) {
      res.status(404).end();
      return;
    }
    res.status(200).json(question);
  } catch (err) {
    next(err);
  }
};

async function ensureSubject(req: Request, _: Response, next: NextFunction): Promise<void> {
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

async function ensureTheme(req: Request, _: Response, next: NextFunction): Promise<void> {
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

async function createQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
  const {
    text,
    points,
    subject,
    theme,
    correctAnswers,
    incorrectAnswers,
  } = req.body;

  // build answers
  const answers = [
    ...correctAnswers.map((answer: string) => ({ text: answer, correct: true })),
    ...incorrectAnswers.map((answer: string) => ({ text: answer, correct: false })),
  ];

  const question: QuestionOld = {
    text,
    answers,
    points: Number(points),
    subject,
    theme,
  };

  const filenames = (req.files as Express.Multer.File[])
    .map((file: Express.Multer.File) => file.filename);


  try {
    const questionId = await questiondb.saveOne(question);

    const mediaInsertPromises = await saveMedia(filenames, questionId);

    // clean up files
    removeUploadedFiles(...filenames);

    await Promise.all(mediaInsertPromises);

    res.status(200).json({ questionId });
  } catch (err) {
    next(err);
  }
};

async function updateQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
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

  const answers: AnswerOld[] = [
    ...correctAnswers.map((answer: string) => ({ text: answer, correct: true })),
    ...incorrectAnswers.map((answer: string) => ({ text: answer, correct: false })),
  ];

  const updatedQuestion: QuestionOld = {
    id,
    text,
    points: Number(points),
    subject,
    theme,
    answers,
  };

  try {
    const success = await questiondb.updateOne(updatedQuestion);

    if (!success) {
      next(new Error('Something went wrong'));
    }

    if (updatedQuestion.id === undefined) {
      throw new Error('Question id is undefined, which can\'t be true...');
    }

    const filenames = (req.files as Express.Multer.File[])
      .map((file: Express.Multer.File) => file.filename);

    // start inserting media
    const mediaInsertPromises = await saveMedia(filenames, updatedQuestion.id);
    // clean up files
    removeUploadedFiles(...filenames);

    const question = await questiondb.getOneById(updatedQuestion.id);

    await Promise.all(mediaInsertPromises);

    res.status(200).json(question);
  } catch (err) {
    next(err);
  }
};
async function deleteQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  try {
    const deleted = await Question.destroy({ where: { id: id }});

    if (deleted === 0) {
      res.status(404).end();
      return;
    }

    if (deleted > 1) {
      res.status(500).end();
      console.log('Deleted more than one instance when deleting by ID');
      return;
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export default {
  getQuestions,
  getQuestionById,

  ensureSubject,
  ensureTheme,

  createQuestion,
  updateQuestion,

  deleteQuestion,
};
