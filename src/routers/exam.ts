import express, { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';

import isAuthenticated from '../middleware/isAuthenticated';
import isTeacher from '../middleware/isTeacher';
import shuffle from '../utils/shuffle';
import { validateExamRequestBody } from '../validators/exam';

import courseController from '../controllers/course';

import questiondb from '../db/questions';
import examdb from '../db/exams';

import { ExamGradeBoundary } from '../models/ExamGradeBoundary';
import { ExamCreationFilter } from '../models/ExamCreationFilter';
import { Question } from '../models/Question';
import { Time } from '../models/Time';
import { Exam } from '../models/Exam';
import { Course } from '../models/Course';

import { pointValues } from '../constants';

interface ExamRequestBody {
  name: string;
  startDate: string;
  endDate: string;
  timeToSolve: Time;
  filters: ExamCreationFilter[];
  boundaries: ExamGradeBoundary[];
}

const createNewExam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    name,
    startDate,
    endDate,
    timeToSolve,
    filters,
    boundaries,
  } = req.body as ExamRequestBody;

  let existingCourses: Course[];
  try {
    existingCourses = await courseController.getAllCourses();
  } catch (err) {
    next(err);
    return;
  }

  // check for boundaries errors
  let error = false;
  boundaries.forEach((boundary) => {
    const found = existingCourses.find((course) => course.id === boundary.course.id);

    // if course not found or found course name is different from the specified one
    if (!found || found.name !== boundary.course.name) {
      error = true;
    }
  });

  if (error) {
    res.status(400).json({ course: 'One of the specified courses does not exist' });
    return;
  }


  // get all questions for each theme filter
  let promises: Promise<Question[]>[] = [];
  filters.forEach((filter: ExamCreationFilter) => {
    filter.themeFilters.forEach((themeFilter) => {
      if (themeFilter.theme.id === null || themeFilter.theme.id === undefined) return;

      promises = [...promises, questiondb.getManyByThemeId(themeFilter.theme.id)];
    });
  });

  let allQuestions: Question[];

  try {
    allQuestions = (await Promise.all(promises)).flat();
  } catch (err) {
    next(err);
    return;
  }

  // compile questions for exam
  let questions: Question[] = [];
  for (let i = 0; i < filters.length; i += 1) {
    const filter = filters[i];
    for (let j = 0; j < filter.themeFilters.length; j += 1) {
      const themeFilter = filter.themeFilters[j];
      const themeQuestions = allQuestions
        .filter((q) => q.theme.id === themeFilter.theme.id);

      let questionsToGoIn: Question[] = [];

      for (let k = 0; k < pointValues.length; k += 1) {
        const pointValue = pointValues[k];
        if (themeFilter[pointValue] !== 0) {
          const pointValueQuestions = themeQuestions.filter((q) => q.points === pointValue);
          if (themeFilter[pointValue] > pointValueQuestions.length) {
            res.status(400).json({
              error: 'Not enough questions inserted for the specified requirements to be fullfiled',
            });
            return;
          }

          const shuffledQuestions = shuffle(pointValueQuestions);
          questionsToGoIn = [
            ...questionsToGoIn,
            ...shuffledQuestions.slice(0, themeFilter[pointValue]),
          ];
        }
      }

      questions = [...questions, ...questionsToGoIn];
    }
  }

  if (req.session === undefined) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const exam: Exam = {
    name,
    startDate: dayjs(startDate),
    endDate: dayjs(endDate),
    timeToSolve,
    questions,
    creator: req.session.account.id,
  };

  let examId: string;

  try {
    examId = await examdb.saveOne(exam, boundaries);
  } catch (err) {
    next(err);
    return;
  }

  res.status(200).json({ examId });
};

const getExamById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { examId } = req.params;

  try {
    const exam = await examdb.getOneById(examId);

    if (!exam) {
      res.status(404).end();
      return;
    }

    // always delete the password hash
    delete exam.creator.passwordHash;

    if (!req.session) throw new Error('req.session is undefined');

    if (req.session.account.roles.includes('admin')) {
      res.status(200).json(exam);
      return;
    }

    if (req.session.account.roles.includes('teacher')) {
      delete exam.creator;
      res.status(200).json(exam);
      return;
    }

    if (req.session.account.roles.includes('student')) {
      const now = dayjs();
      const startDate = dayjs(exam.startDate);

      // if start date is in the future
      if (startDate.isAfter(now)) {
        delete exam.questions;
      }

      res.status(200).json(exam);
      return;
    }

    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};

const getExamInfos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.session) throw new Error('req.session is undefined');


  try {
    if (
      req.session.account.roles.includes('admin')
      || req.session.account.roles.includes('teacher')
    ) {
      const exams = (await examdb.getAllExamInfos()).map((exam) => {
        const copy = { ...exam };
        delete copy.creator;
        delete copy.questions;

        return copy;
      });

      res.status(200).json(exams);
      return;
    }

    if (req.session.account.roles.includes('student')) {
      const exams = (await examdb.getUpcomingExamInfos()).map((exam) => {
        const copy = { ...exam };
        delete copy.creator;
        delete copy.questions;

        return copy;
      });

      res.status(200).json(exams);
      return;
    }

    res.status(200).json([]);
  } catch (err) {
    next(err);
  }
};

const router = express.Router();

router.use(isAuthenticated);

router.get('/', getExamInfos);
router.get('/:examId', getExamById);
router.post('/', isTeacher, validateExamRequestBody, createNewExam);

export default router;
