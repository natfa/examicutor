import { PoolConnection } from 'mysql';
import dayjs from 'dayjs';

import query, { pool } from './index';
import { OkPacket } from './OkPacket';

import { buildAccount, AccountsRowDataPacket } from './accounts';
import { buildQuestions, FullQuestionsRowDataPacket } from './questions';
import { buildSpecialty, SpecialtiesRowDataPacket } from './specialties';

import { Question } from '../models/Question';
import { Time } from '../models/Time';
import { Exam } from '../models/Exam';
import { Account } from '../models/Account';
import { ExamGradeBoundary } from '../models/ExamGradeBoundary';

interface ExamsRowDataPacket {
  id: number;
  name: string;
  startdate: Date;
  enddate: Date;
  timetosolve: string;
  creatorid: number;
}

interface ExamGradeBoundariesRowDataPacket {
  id: number;
  exam_id: number;
  specialty_id: number;
  three: number;
  four: number;
  five: number;
  six: number;
}

interface FullExamGradeBoundaryRowDataPacket {
  specialties: SpecialtiesRowDataPacket;
  exam_boundaries: ExamGradeBoundariesRowDataPacket;
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

function buildExamBoundary(dataPacket: FullExamGradeBoundaryRowDataPacket): ExamGradeBoundary {
  const specialty = buildSpecialty(dataPacket.specialties);

  const gradeBoundary: ExamGradeBoundary = {
    specialty,
    3: dataPacket.exam_boundaries.three,
    4: dataPacket.exam_boundaries.four,
    5: dataPacket.exam_boundaries.five,
    6: dataPacket.exam_boundaries.six,
  };

  return gradeBoundary;
}

function saveOne(exam: Exam, boundaries: ExamGradeBoundary[]): Promise<string> {
  let examId: number;

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
    })
      .then((result: OkPacket) => {
        examId = result.insertId;

        const examQuestionsInserts = exam.questions.map((question: Question) => {
          const promise = query({
            sql: `insert into exam_questions
            (examid, questionid) value
            (?, ?)`,
            values: [examId, question.id],
          });

          return promise;
        });

        return Promise.all(examQuestionsInserts);
      })
      .then(() => { // receives: results: OkPacket[]
        const boundaryInserts = boundaries.map((boundary) => query({
          sql: `insert into exam_boundaries
          (three, four, five, six, specialty_id, exam_id) value
          (?, ?, ?, ?, ?, ?)`,
          values: [
            boundary[3],
            boundary[4],
            boundary[5],
            boundary[6],
            boundary.specialty.id,
            examId,
          ],
        }));

        Promise.all(boundaryInserts).then(() => resolve(String(examId)));
      })
      .catch((err) => {
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

function getExamBoundaries(examId: string): Promise<ExamGradeBoundary[]> {
  return new Promise<ExamGradeBoundary[]>((resolve, reject) => {
    pool.getConnection((connectionError: Error, connection: PoolConnection) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      connection.query({
        sql: `select exam_boundaries.*, specialties.* from exam_boundaries
        inner join specialties
          on exam_boundaries.specialty_id = specialties.id
        where exam_id = ?`,
        values: [examId],
        nestTables: true,
      }, (queryError: Error|null, results: FullExamGradeBoundaryRowDataPacket[]) => {
        if (queryError) {
          reject(queryError);
          return;
        }

        connection.release();

        const examBoundaries = results.map((result) => buildExamBoundary(result));

        resolve(examBoundaries);
      });
    });
  });
}

export default {
  saveOne,
  getOneById,
  getAllExamInfos,
  getUpcomingExamInfos,
  getExamBoundaries,
};
