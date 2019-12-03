import express, { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';

import examController from '../controllers/exam.controller';

import isStudent from '../middleware/isStudent';

import { validateSaveAnswerBody } from '../validators/solve';

function getExamById(req: Request, res: Response, next: NextFunction): void {
  const { examId } = req.params;

  examController
    .getExamById(examId)
    .then(examController.stripExam)
    .then((strippedExam) => {
      if (strippedExam === null) {
        res.status(404).end();
        return;
      }

      const now = dayjs();
      const examStartDate = dayjs(strippedExam.startDate);

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
        exam: strippedExam,
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

function submitExam(req: Request, res: Response, next: NextFunction): void {
  next('Not implemented');
}


const router = express.Router();

router.use(isStudent);

router.get('/:examId', getExamById);
router.post('/answer', validateSaveAnswerBody, saveAnswer);
router.post('/submit', submitExam);

export default router;
