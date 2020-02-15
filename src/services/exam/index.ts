import { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';

import { pointValues } from '../../constants';
import shuffle from '../../utils/shuffle';

import studentdb from '../../db/students';
import specialtydb from '../../db/specialties';
import questiondb from '../../db/questions';
import examdb from '../../db/exams';

import { Student } from '../../models/Student';
import { ExamInfo } from '../../models/ExamInfo';
import { Exam } from '../../models/Exam';
import { Time } from '../../models/Time';
import { ExamCreationFilter } from '../../models/ExamCreationFilter';
import { ExamGradeBoundary } from '../../models/ExamGradeBoundary';
import { Specialty } from '../../models/Specialty';
import { Question } from '../../models/Question';

interface ExamRequestBody {
  name: string;
  startDate: string;
  endDate: string;
  timeToSolve: Time;
  filters: ExamCreationFilter[];
  boundaries: ExamGradeBoundary[];
}

async function createNewExam(req: Request, res: Response, next: NextFunction): Promise<void> {
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
    existingSpecialties = await specialtydb.getAllSpecialties();
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
    const exam = await examdb.getOneById(examId);

    if (!exam) {
      res.status(404).end();
      return;
    }

    // never send out passwordhash
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
      const student = await studentdb.getStudentByAccountId(req.session.account.id);

      // ensure studentId
      if (student === null) {
        throw new Error('A student with role student does not have a student entry in the DB');
      }

      // if start date is in the future
      if (startDate.isAfter(now)) {
        delete exam.questions;
      }

      // ensure exam.id
      if (exam.id === undefined) throw new Error('exam.id is undefined after being fetched from DB');

      const studentExamResults = await examdb.getStudentExamResults(exam.id, student.id);

      const hasSubmitted = studentExamResults === null ? false : true;

      if (hasSubmitted) {
        res.status(200).json({ exam, hasSubmitted: true });
      } else {
        res.status(200).json({ exam, hasSubmitted: false });
      }

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
    const student = await studentdb.getStudentByAccountId(account.id);

    if (student !== null) { // the account is a student
      exams = await examdb.getAllStudentExams(student.id);
    } else {
      exams = await examdb.getAllExams();
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
    const student = await studentdb.getStudentByAccountId(account.id);
    const now = dayjs();

    if (student !== null) { // the account is a student
      exams = await examdb.getStudentExamsAfter(student.id, now);
    } else {
      exams = await examdb.getExamsAfter(now);
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
    const student = await studentdb.getStudentByAccountId(account.id);
    const now = dayjs();

    if (student !== null) { // the account is a student
      exams = await examdb.getStudentExamsBefore(student.id, now);
    } else {
      exams = await examdb.getExamsBefore(now);
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

    let student: Student|null;

    // permissions check
    if (req.session.account.roles.includes('student')) {
      student = await studentdb.getStudentByAccountId(req.session.account.id);

      if (student === null) {
        res.status(404).end();
        return;
      }

      if (student.id !== studentId) {
        res.status(403).end();
        return;
      }
    } else {
      student = await studentdb.getStudentById(studentId);

      if (student === null) {
        res.status(404).end();
        return;
      }
    }

    const examResults = await examdb.getStudentExamResults(examId, studentId);

    res.status(200).json(examResults);
  } catch (err) {
    next(err);
  }
}

async function getExamResults(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.session === undefined) throw new Error('req.session is undefined');

  try {
    const { examId } = req.params;
    const { account } = req.session;

    // only teachers and admins are allowed
    if (!account.roles.includes('teacher') && !account.roles.includes('admin')) {
      res.status(403).end();
      return;
    }

    const grades = await examdb.getExamGrades(examId);

    res.status(200).json(grades);
  } catch (err) {
    next(err);
  }
}
export default {
  getAllExams,
  getUpcomingExams,
  getPastExams,
  getExamById,
  getExamResults,
  getStudentExamResults,
  createNewExam,
}
