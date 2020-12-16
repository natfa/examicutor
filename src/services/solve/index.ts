import { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';

import { Exam } from '../../models/Exam';

function getExamById(req: Request, res: Response, next: NextFunction): void {
  const { examId } = req.params;

  Exam
    .findByPk(examId)
    .then((exam) => {
      if (exam === null) {
        res.status(404).end();
        return;
      }

      const now = dayjs();
      const examStartDate = dayjs(exam.startDate);

      if (examStartDate.isAfter(now)) {
        res.status(400).end();
        return;
      }

      if (req.session === undefined) throw new Error('req.session is undefined');

      if (req.session.exam === undefined) {
        req.session.exam = {
          answered: [],
        };
      }

      res.status(200).json({
        exam: exam.toJSON(),
        answered: req.session.exam.answered,
      });
    })
    .catch((err) => {
      next(err);
    });
}

function saveAnswer(req: Request, res: Response): void {
  if (req.session === undefined) throw new Error('req.session is undefined');

  const { questionId, answerId } = req.body;
  const { answered } = req.session.exam;

  req.session.exam.answered = [
    ...answered,
    { questionId, answerId },
  ];

  res.status(204).end();
}

async function submitExam(req: Request, res: Response, next: NextFunction): Promise<void> {
  throw new Error('Not implemented');
}

export default {
  getExamById,
  saveAnswer,
  submitExam,
}
