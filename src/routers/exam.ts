import express, { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';

import isAuthenticated from '../middleware/isAuthenticated';
import isTeacher from '../middleware/isTeacher';
import shuffle from '../utils/shuffle';
import validateExamRequestBody from '../validators/exam';

import examController from '../controllers/exam';
import specialtyController from '../controllers/specialty';
import studentController from '../controllers/student';

import questiondb from '../db/questions';
import examdb from '../db/exams';

import { ExamGradeBoundary } from '../models/ExamGradeBoundary';
import { ExamCreationFilter } from '../models/ExamCreationFilter';
import { Question } from '../models/Question';
import { Time } from '../models/Time';
import { Exam } from '../models/Exam';
import { Specialty } from '../models/Specialty';
import { ExamInfo } from '../models/ExamInfo';

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

  let existingSpecialties: Specialty[];
  try {
    existingSpecialties = await specialtyController.getAllSpecialties();
  } catch (err) {
    next(err);
    return;
  }

  // check for boundaries errors
  let error = false;
  boundaries.forEach((boundary) => {
    const found = existingSpecialties.find((specialty) => specialty.id === boundary.specialty.id);

    // if course not found or found course name is different from the specified one
    if (!found || found.name !== boundary.specialty.name) {
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

async function getExamById(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { examId } = req.params;

  try {
    const exam = await examController.getExamById(examId);

    if (!exam) {
      res.status(404).end();
      return;
    }

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
}

async function getAllExams(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.session === undefined) throw new Error('req.session is undefined');

  const { account } = req.session;

  try {
    let exams: ExamInfo[];
    const studentId = await studentController.getStudentId(account.id);

    if (studentId !== null) { // the account is a student
      exams = await examController.getAllExams(studentId);
    } else {
      exams = await examController.getAllExams();
    }

    res.status(200).json(exams);
  } catch (err) {
    next(err);
  }
}

async function getUpcomingExams(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.session === undefined) throw new Error('req.session is undefined');

  const { account } = req.session;

  try {
    let exams: ExamInfo[];
    const studentId = await studentController.getStudentId(account.id);

    if (studentId !== null) { // the account is a student
      exams = await examController.getUpcomingExams(studentId);
    } else {
      exams = await examController.getUpcomingExams();
    }

    res.status(200).json(exams);
  } catch (err) {
    next(err);
  }
}

async function getPastExams(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.session === undefined) throw new Error('req.session is undefined');

  const { account } = req.session;

  try {
    let exams: ExamInfo[];
    const studentId = await studentController.getStudentId(account.id);

    if (studentId !== null) { // the account is a student
      exams = await examController.getPastExams(studentId);
    } else {
      exams = await examController.getPastExams();
    }

    res.status(200).json(exams);
  } catch (err) {
    next(err);
  }
}

async function getStudentExamResults(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (req.session === undefined) throw new Error('req.session is undefined');

  try {
    const { examId, studentId } = req.params;

    const actualStudentId = await studentController.getStudentId(req.session.account.id);

    if (actualStudentId !== studentId && req.session.account.roles.includes('student')) {
      res.status(403).end();
      return;
    }

    const examResults = await examController.getStudentExamResults(examId, studentId);

    res.status(200).json({ examResults });
  } catch (err) {
    next(err);
  }
}

const router = express.Router();

router.use(isAuthenticated);

router.get('/', getAllExams);
router.get('/upcoming', getUpcomingExams);
router.get('/past', getPastExams);
router.get('/:examId', getExamById);

router.get('/:examId/results/:studentId', getStudentExamResults);

router.post('/', isTeacher, validateExamRequestBody, createNewExam);

export default router;
