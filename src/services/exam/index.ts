import Joi from 'joi';
import { Op } from 'sequelize';
import { Request, Response, NextFunction } from 'express';

import { shuffle } from '../../utils/shuffle';
import { db } from '../../models';

import { ExamSchema } from '../../models/Exam';
import { SpecialtySchema } from '../../models/Specialty';
import { Question } from '../../models/Question';

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

  // fetch questions based on parameters
  const allQuestions: Question[][] = await Promise.all(body.parameters.map(p => {
    return db.Question.findAll({
      where: {
        themeId: p.theme.id,
      },
      include: [
        db.Question.associations.theme,
      ],
    });
  }));

  // validate that there are enough questions to fill in the parameters
  for (let i = 0; i < body.parameters.length; i++) {
    if (body.parameters[i].count > allQuestions[i].length) {
      res.status(400).send('Not enough questions to create an exam with those parameters')
      return;
    }
  }

  // create exam itself
  const exam = await db.Exam.create({
    name: value.name,
    startDate: value.startDate,
    timeToSolve: value.timeToSolve,
    parameters: value.parameters.map(p => ({
      themeId: p.theme.id,
      count: p.count,
    })),
  }, {
    include: [
      {
        association: db.Exam.associations.parameters,
        include: [db.ExamParameter.associations.theme],
      }
    ]
  });

  // send result to client, no need for them to wait any further
  res.status(200).send(exam.toJSON());

  // time to create an exam for each student
  // fetch students
  const students = await db.Student.findAll({
    where: {
      [Op.or]: body.specialties.map(s => ({
        studiesIn: s.id,
      })),
    },
    include: [db.Student.associations.user],
  });


  // for each student, create their exam
  students.forEach(async student => {
    let selectedQuestions: Question[] = [];

    for(let i = 0; i < body.parameters.length; i++) {
      const parameter = body.parameters[i];
      const questions: Question[] = shuffle(allQuestions[i]);

      selectedQuestions = [...selectedQuestions, ...questions.slice(0, parameter.count)]
    }

    db.StudentExam.create({
      examId: exam.id,
      studentId: student.id,
      questions: selectedQuestions.map(q => ({
        questionId: q.id,
      })),
    }, {
      include: [db.StudentExam.associations.questions],
    });
  })
};

async function getExamById(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.session === undefined) throw new Error('req.session is undefined');

  const { examId } = req.params;

  let options: object = {};

  if (req.session.user.role === 'student') {
    const student = await db.Student.findOne({ where: { userId: req.session.user.id }});

    if (!student) throw new Error(`User with role ${req.session.user.role} doesn't have a student entry`);

    options = {
      include: [
        {
          association: db.Exam.associations.studentExams,
          where: {
            studentId: student.id
          }
        }
      ]
    }
  }

  const exam = await db.Exam.findByPk(examId, options);

  if (!exam) {
    res.status(404).end();
    return;
  }

  res.status(200).json(exam.toJSON());
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
  if (req.session === undefined) {
    throw new Error('req.session is undefined');
  }

  const today = new Date().setHours(0, 0, 0, 0);
  let query: object = {
    where: {
      startDate: {
        [Op.gte]: today,
      },
    }
  }

  if (req.session.user.role === 'student') {
    const student = await db.Student.findOne({ where: { userId: req.session.user.id }});
    if (student === null) {
      throw new Error(`Student not found for userId ${req.session.user.id} but session says that role is ${req.session.user.role}.`);
    }

    query = {
      ...query,
      include: [
        {
          association: db.Exam.associations.studentExams,
          where: {
            studentId: student.id,
          },
        },
      ],
    }
  }

  const upcomingExams = await db.Exam.findAll(query);

  res.status(200).json(upcomingExams.map(e => e.toJSON()));
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
