import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import dayjs from 'dayjs';

import { db } from '../../models';

/**
 * Get an exam by its ID for solving, not just for viewing
 */
async function getExamById(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.session === undefined) throw new Error('req.session is undefined');

  const { examId } = req.params;

  const student = await db.Student.findOne({ where: { userId: req.session.user.id }});
  if (!student) {
    throw new Error(`User with role ${req.session.user.role} doesn't have a student entry.`);
  }

  const exam = await db.Exam.findByPk(examId, {
    include: [
      {
        association: db.Exam.associations.studentExams,
        where: {
          studentId: student.id,
        },
        include: [
          {
            association: db.StudentExam.associations.questions,
            include: [
              {
                association: db.StudentExamQuestion.associations.question,
                include: [ db.Question.associations.answers ],
              }
            ],
          },
        ],
      },
    ],
  });

  if (!exam) {
    res.status(404).end();
    return;
  }

  const now = dayjs();
  const examStartDate = dayjs(exam.startDate);

  // don't allow to solve before time is right
  if (now.isBefore(examStartDate)) {
    res.status(400).end();
    return;
  }

  res.status(200).json(exam.toJSON());
}

async function saveAnswer(req: Request, res: Response): Promise<void> {
  const bodySchema = Joi.object({
    studentExamId: Joi.number().required(),
    questionId: Joi.number().required(),
    givenAnswerId: Joi.number().required(),
  });

  const { value: body, error } = bodySchema.validate(req.body);
  if (error) {
    res.status(400).send(error);
  }

  const studentExamQuestion = await db.StudentExamQuestion.findOne({
    where: {
      studentExamId: body.studentExamId,
      questionId: body.questionId,
    }
  });

  if (!studentExamQuestion) {
    res.status(404).end();
    return;
  }

  studentExamQuestion.givenAnswerId = body.givenAnswerId;
  await studentExamQuestion.save();

  res.status(204).end();
}

async function submitExam(req: Request, res: Response, next: NextFunction): Promise<void> {
  const schema = Joi.object({
    examId: Joi.number().required(),
  });

  const { value, error } = schema.validate(req.body);

  if (error) {
    console.error('Got an error while submitting exam:');
    console.error(error);

    res.status(400).send(error.message);
    return;
  }

  if (!req.session) {
    throw new Error("req.session is falsy");
  }

  const student = await db.Student.findOne({ where: { userId: req.session.user.id }});
  if (student === null) {
    throw new Error(`Couldn't find a student with userId ${req.session.user.id} but role was ${req.session.user.role}`)
  }

  db.StudentExam.update({
      grade: 6,
    },
    {
    where: {
      examId: value.examId,
      studentId: student.id,
    }
  });

  res.status(204).end();
}

export default {
  getExamById,
  saveAnswer,
  submitExam,
}
