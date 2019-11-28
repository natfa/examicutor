import dayjs from 'dayjs';

import query from './index';
import { OkPacket } from './OkPacket';

import { buildAccount, AccountsRowDataPacket } from './accounts';
import { buildQuestions, FullQuestionsRowDataPacket } from './questions';

import { Question } from '../models/Question';
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

      const examQuestionsInserts = exam.questions.map((question: Question) => {
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
      inner join accounts
        on exams.creatorid = accounts.id
      where exams.id = ?`,
      values: [id],
      nestTables: true,
    })
      .then((results: FullExamRowDataPacket[]) => {
        if (results.length === 0) return resolve(null);

        exam = buildExam(results[0]);

        return query({
          sql: `select questions.*, subjects.*, themes.*, answers.* from questions
          inner join subjects
            on questions.subjectid = subjects.id
          inner join themes
            on questions.themeid = themes.id
          inner join answers
            on questions.id = answers.questionid
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
        const questions = buildQuestions(results);
        exam.questions = questions;

        resolve(exam);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getAllExamInfos(): Promise<Exam[]> {
  return new Promise<Exam[]>((resolve, reject) => {
    query({
      sql: `select exams.*, accounts.* from exams
      inner join accounts
        on exams.creatorid = accounts.id`,
      nestTables: true,
    })
      .then((results: FullExamRowDataPacket[]) => {
        const exams = results.map((result) => buildExam(result));

        resolve(exams);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getUpcomingExamInfos(): Promise<Exam[]> {
  const now = dayjs();

  return new Promise<Exam[]>((resolve, reject) => {
    query({
      sql: `select exams.*, accounts.* from exams
      inner join accounts
        on exams.creatorid = accounts.id
      where date(exams.startdate) >= date(?)`,
      values: [new Date(now.toString())],
      nestTables: true,
    })
      .then((results: FullExamRowDataPacket[]) => {
        const exams = results.map((result) => buildExam(result));

        resolve(exams);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default {
  saveOne,
  getOneById,
  getAllExamInfos,
  getUpcomingExamInfos,
};
