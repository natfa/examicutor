import dayjs from 'dayjs';

import query from './index';
import { OkPacket } from './OkPacket';

import { buildAccount, AccountsRowDataPacket } from './accounts';
import {
  buildQuestion,
  addAnswerToQuestion,
  FullQuestionsRowDataPacket,
  AnswersRowDataPacket,
} from './questions';

import { QuestionBase } from '../models/QuestionBase';
import { Time } from '../models/Time';
import { Exam } from '../models/Exam';
import { Account } from '../models/Account';

interface ExamsRowDataPacket {
  id: number;
  name: string;
  startdate: Date;
  enddate: Date;
  timetosolve: string;
  creatorid: number;
}

interface ExamQuestionsRowDataPacket {
  id: number;
  examid: number;
  questionid: number;
}

interface FullExamRowDataPacket {
  exams: ExamsRowDataPacket;
  accounts: AccountsRowDataPacket;
}

function buildExam(dataPacket: FullExamRowDataPacket): Exam {
  const account: Account = buildAccount(dataPacket.accounts);

  const [
    hours,
    minutes,
  ] = dataPacket.exams.timetosolve.split(':');

  const timeToSolve: Time = {
    hours: Number(hours),
    minutes: Number(minutes),
  };

  const exam: Exam = {
    id: String(dataPacket.exams.id),
    name: dataPacket.exams.name,
    startDate: dayjs(dataPacket.exams.startdate),
    endDate: dayjs(dataPacket.exams.enddate),
    timeToSolve,
    questions: [],
    creator: account,
  };

  return exam;
}

function saveOne(exam: Exam): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const timeToSolve = dayjs()
      .hour(exam.timeToSolve.hours)
      .minute(exam.timeToSolve.minutes)
      .second(0)
      .millisecond(0);

    query({
      sql: `insert into exams
      (name, startdate, enddate, timetosolve, creatorid) values
      (?, ?, ?, ?, ?)`,
      values: [
        exam.name,
        // we must use std Date objects so that the mysql lib can parse them correctly
        new Date(exam.startDate.toString()),
        new Date(exam.endDate.toString()),
        new Date(timeToSolve.toString()),
        1,
      ],
    }).then((result: OkPacket) => {
      const examId = result.insertId;

      const examQuestionsInserts = exam.questions.map((question: QuestionBase) => {
        const promise = query({
          sql: `insert into exam_questions
          (examid, questionid) values
          (?, ?)`,
          values: [examId, question.id],
        });

        return promise;
      });

      Promise.all(examQuestionsInserts).then(() => resolve(String(examId)));
    }).catch((err) => {
      reject(err);
    });
  });
}

function getOneById(id: string): Promise<Exam|null> {
  let exam: Exam;

  return new Promise<Exam|null>((resolve, reject) => {
    query({
      sql: `select exams.*, accounts.* from exams
      inner join exam_questions
        on exams.id = exam_questions.examid
      inner join accounts
        on exams.creatorid = accounts.id
      where exams.id = ?`,
      values: [id],
      nestTables: true,
    })
      .then((results: FullExamRowDataPacket[]) => {
        exam = buildExam(results[0]);

        return query({
          sql: `select questions.*, subjects.*, themes.* from questions
          inner join subjects
            on questions.subjectid = subjects.id
          inner join themes
            on questions.themeid = themes.id
          inner join exam_questions
            on exam_questions.questionid = questions.id
          inner join exams
            on exams.id = exam_questions.examid
          where exams.id = ?`,
          values: [id],
          nestTables: true,
        });
      })
      .then((results: FullQuestionsRowDataPacket[]) => {
        const questions = results.map((result) => buildQuestion(result));
        exam.questions = questions;

        return query({
          sql: `select answers.* from answers
          inner join questions
            on answers.questionid = questions.id
          inner join exam_questions
            on exam_questions.questionid = questions.id
          where exam_questions.examid = ?`,
          values: [id],
        });
      })
      .then((results: AnswersRowDataPacket[]) => {
        let newQuestions = exam.questions;

        // iterate over answers
        results.forEach((result) => {
          // for each answer, update the newQuestions array
          // with answer added
          newQuestions = newQuestions.map((q) => {
            if (String(result.questionid) !== q.id) return q;

            return addAnswerToQuestion(result, q);
          });
        });

        // save updated questions array
        exam.questions = newQuestions;

        resolve(exam);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default {
  saveOne,
  getOneById,
};
