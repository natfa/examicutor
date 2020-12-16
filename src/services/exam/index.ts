import { Request, Response, NextFunction } from 'express';

import { Exam } from '../../models';

async function createNewExam(req: Request, res: Response, next: NextFunction): Promise<void> {
  res.status(500).send('Not implemented');
};

async function getExamById(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { examId } = req.params;

  try {
    const exam = await Exam.findByPk(examId);

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
    const exams = await Exam.findAll();

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
