import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

import { db } from '../../models';

import { ExamSchema } from '../../models/Exam';
import { SpecialtySchema } from '../../models/Specialty';

async function createNewExam(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { body } = req;

  const schema = ExamSchema.keys({
    specialties: Joi
      .array()
      .items(SpecialtySchema)
      .required(),
  });

  // validate input data
  const { value, error } = schema.validate(body);

  if (error !== undefined) {
    console.error(`Received invalid request body:\n${error.message}`);
    res.status(400).send(error.message);
    return;
  }

  const exam = await db.Exam.create({
    name: value.name,
    startDate: value.startDate,
    timeToSolve: value.timeToSolve,
  });

  res.status(200).json(exam.toJSON());

  const parameters = await db.ExamParameter.bulkCreate(value.parameters.map(p => ({
    themeId: p.theme.id,
    examId: exam.id,
    count: p.count,
  })));

  // create exams for students as well
};

async function getExamById(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { examId } = req.params;

  try {
    const exam = await db.Exam.findByPk(examId);

    if (!exam) {
      res.status(404).end();
      return;
    }

    res.status(200).json(exam.toJSON());
  } catch (err) {
    next(err);
  }
}

async function getAllExams(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const exams = await db.Exam.findAll();

    res.status(200).json(exams);
  } catch (err) {
    next(err);
  }
}

async function getUpcomingExams(req: Request, res: Response, next: NextFunction): Promise<void> {
  res.status(500).send('Not implemented');
}

async function getPastExams(req: Request, res: Response, next: NextFunction): Promise<void> {
  res.status(500).send('Not implemented');
}

async function getStudentExamResults(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  res.status(500).send('Not implemented');
}

async function getExamResults(req: Request, res: Response, next: NextFunction): Promise<void> {
  res.status(500).send('Not implemented');
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
