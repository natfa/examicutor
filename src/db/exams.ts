import { PoolConnection } from 'mysql';
import dayjs, { Dayjs } from 'dayjs';

import query, { pool } from './index';
import { OkPacket } from './OkPacket';

import { buildAccount, AccountsRowDataPacket } from './accounts';
import { buildQuestions, FullQuestionsRowDataPacket } from './questions';
import { buildSpecialty, SpecialtiesRowDataPacket } from './specialties';
import studentdb, { buildStudent, StudentsRowDataPacket, FullStudentRowDataPacket } from './students';

import { QuestionOld } from '../models/Question';
import { TimeOld } from '../models/Time';
import { ExamOld } from '../models/Exam';
import { AccountOld } from '../models/Account';
import { ExamGradeBoundaryOld } from '../models/ExamGradeBoundary';
import { ExamInfoOld } from '../models/ExamInfo';
import { StudentSolutionOld } from '../models/StudentSolution';
import { QuestionSolutionOld } from '../models/QuestionSolution';
import { ExamResultOld } from '../models/ExamResult';
import { ExamGradeOld } from '../models/ExamGrade';
import { StudentOld } from '../models/Student';

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

function buildExamInfo(dataPacket: ExamsRowDataPacket): ExamInfoOld {
  const [hours, minutes] = dataPacket.timetosolve.split(':');

  const exam: ExamInfoOld = {
    id: String(dataPacket.id),
    name: dataPacket.name,
    startDate: dayjs(dataPacket.startdate),
    endDate: dayjs(dataPacket.enddate),
    timeToSolve: {
      hours: Number(hours),
      minutes: Number(minutes),
    },
  };

  return exam;
}

function buildExam(dataPacket: FullExamRowDataPacket): ExamOld {
  const account: AccountOld = buildAccount(dataPacket.accounts);

  const [
    hours,
    minutes,
  ] = dataPacket.exams.timetosolve.split(':');

  const timeToSolve: TimeOld = {
    hours: Number(hours),
    minutes: Number(minutes),
  };

  const exam: ExamOld = {
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

function buildExamBoundary(dataPacket: FullExamGradeBoundaryRowDataPacket): ExamGradeBoundaryOld {
  const specialty = buildSpecialty(dataPacket.specialties);

  const gradeBoundary: ExamGradeBoundaryOld = {
    specialty,
    3: dataPacket.exam_boundaries.three,
    4: dataPacket.exam_boundaries.four,
    5: dataPacket.exam_boundaries.five,
    6: dataPacket.exam_boundaries.six,
  };

  return gradeBoundary;
}

function saveOne(exam: ExamOld, boundaries: ExamGradeBoundaryOld[]): Promise<string> {
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

        const examQuestionsInserts = exam.questions.map((question: QuestionOld) => {
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

function getOneById(id: string): Promise<ExamOld|null> {
  let exam: ExamOld;

  return new Promise<ExamOld|null>((resolve, reject) => {
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

function getAllExamInfos(): Promise<ExamOld[]> {
  return new Promise<ExamOld[]>((resolve, reject) => {
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

function getUpcomingExamInfos(): Promise<ExamOld[]> {
  const now = dayjs();

  return new Promise<ExamOld[]>((resolve, reject) => {
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

function getExamBoundaries(examId: string): Promise<ExamGradeBoundaryOld[]> {
  return new Promise<ExamGradeBoundaryOld[]>((resolve, reject) => {
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

/**
 * Fetches all exams saved in the database.
 *
 * @returns {ExamInfo[]} All exams saved on the database.
 */
function getAllExams(): Promise<ExamInfoOld[]> {
  return new Promise<ExamInfoOld[]>((resolve, reject) => {
    pool.getConnection((connectionError: Error|null, connection: PoolConnection) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      connection.query({
        sql: 'select * from exams',
      }, (queryError: Error|null, results: ExamsRowDataPacket[]) => {
        if (queryError) {
          reject(queryError);
          return;
        }

        connection.release();

        const exams = results.map((result) => buildExamInfo(result));
        resolve(exams);
      });
    });
  });
}

/**
 * Fetches exams that have an end date that's after the specified date.
 * @param {Dayjs} date - The specified date
 *
 * @returns {ExamInfo[]} The exams fetched.
 */
function getExamsAfter(date: Dayjs): Promise<ExamInfoOld[]> {
  return new Promise<ExamInfoOld[]>((resolve, reject) => {
    pool.getConnection((connectionError: Error, connection: PoolConnection) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      connection.query({
        sql: `select * from exams
        where exams.enddate >= ?`,
        values: [
          new Date(date.toString()),
        ],
      }, (queryError: Error|null, results: ExamsRowDataPacket[]) => {
        if (queryError) {
          reject(queryError);
          return;
        }
        connection.release();

        const exams = results.map((result) => buildExamInfo(result));
        resolve(exams);
      });
    });
  });
}

/**
 * Fetches exams that have an end date that's before the specified date.
 * @param {Dayjs} date - The specified date
 *
 * @returns {ExamInfo[]} The exams fetched.
 */
function getExamsBefore(date: Dayjs): Promise<ExamInfoOld[]> {
  return new Promise<ExamInfoOld[]>((resolve, reject) => {
    pool.getConnection((connectionError: Error, connection: PoolConnection) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      connection.query({
        sql: `select * from exams
        where exams.enddate <= ?`,
        values: [
          new Date(date.toString()),
        ],
      }, (queryError: Error|null, results: ExamsRowDataPacket[]) => {
        if (queryError) {
          reject(queryError);
          return;
        }
        connection.release();

        const exams = results.map((result) => buildExamInfo(result));
        resolve(exams);
      });
    });
  });
}

function getAllStudentExams(studentId: string): Promise<ExamInfoOld[]> {
  return new Promise<ExamInfoOld[]>((resolve, reject) => {
    pool.getConnection((connectionError: Error|null, connection: PoolConnection) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      connection.query({
        sql: `select exams.* from exams
        inner join exam_boundaries
          on exam_boundaries.exam_id = exams.id
        inner join specialties
          on specialties.id = exam_boundaries.specialty_id
        inner join students
          on students.specialty_id = specialties.id
        where students.id = ?`,
        values: [studentId],
      }, (queryError: Error|null, results: ExamsRowDataPacket[]) => {
        if (queryError) {
          reject(queryError);
          return;
        }

        connection.release();

        const exams = results.map((result) => buildExamInfo(result));
        resolve(exams);
      });
    });
  });
}

function getStudentExamsBefore(studentId: string, date: Dayjs): Promise<ExamInfoOld[]> {
  return new Promise<ExamInfoOld[]>((resolve, reject) => {
    pool.getConnection((connectionError: Error|null, connection: PoolConnection) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      connection.query({
        sql: `select exams.* from exams
        inner join exam_boundaries
          on exam_boundaries.exam_id = exams.id
        inner join specialties
          on specialties.id = exam_boundaries.specialty_id
        inner join students
          on students.specialty_id = specialties.id
        where students.id = ? and exams.enddate <= ?`,
        values: [
          studentId,
          new Date(date.toString()),
        ],
      }, (queryError: Error|null, results: ExamsRowDataPacket[]) => {
        if (queryError) {
          reject(queryError);
          return;
        }

        connection.release();
        const exams = results.map((result) => buildExamInfo(result));
        resolve(exams);
      });
    });
  });
}

function getStudentExamsAfter(studentId: string, date: Dayjs): Promise<ExamInfoOld[]> {
  return new Promise<ExamInfoOld[]>((resolve, reject) => {
    pool.getConnection((connectionError: Error|null, connection: PoolConnection) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      connection.query({
        sql: `select exams.* from exams
        inner join exam_boundaries
          on exam_boundaries.exam_id = exams.id
        inner join specialties
          on specialties.id = exam_boundaries.specialty_id
        inner join students
          on students.specialty_id = specialties.id
        where students.id = ? and exams.enddate >= ?`,
        values: [
          studentId,
          new Date(date.toString()),
        ],
      }, (queryError: Error|null, results: ExamsRowDataPacket[]) => {
        if (queryError) {
          reject(queryError);
          return;
        }

        connection.release();
        const exams = results.map((result) => buildExamInfo(result));
        resolve(exams);
      });
    });
  });
}

function saveStudentGrade(examId: string, studentId: string, grade: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    pool.getConnection((connectionError: Error|null, connection: PoolConnection) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      connection.query({
        sql: `insert into exam_grades
          (exam_id, student_id, grade) value
          (?, ?, ?)`,
        values: [examId, studentId, grade],
      }, (queryError: Error|null, results: OkPacket) => {
        if (queryError) {
          reject(queryError);
          return;
        }

        connection.release();

        if (results.insertId === undefined) {
          reject(new Error('New grade not inserted correctly'));
          return;
        }

        resolve();
      });
    });
  });
}

function saveStudentSolution(studentSolution: StudentSolutionOld): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (studentSolution.solution.length === 0) {
      resolve();
      return;
    }

    pool.getConnection((connectionError: Error|null, connection: PoolConnection) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      let sqlQuery = `insert into student_exam_answers
      (student_id, exam_id, question_id, answer_id) values `;
      let values: string[] = [];

      sqlQuery += studentSolution.solution.map((questionAnswer: QuestionSolutionOld) => {
        const str = '(?, ?, ?, ?)';
        values = [
          ...values,
          studentSolution.student.id,
          studentSolution.examId,
          questionAnswer.questionId,
          questionAnswer.answerId,
        ];

        return str;
      }).join(', ');
      sqlQuery += ';';

      connection.query({
        sql: sqlQuery,
        values,
      }, (queryError: Error|null, results: OkPacket) => {
        if (queryError) {
          reject(queryError);
          return;
        }

        connection.release();

        if (
          results.insertId === undefined || studentSolution.solution.length !== results.affectedRows
        ) {
          reject(new Error('Answers not inserted correctly'));
          return;
        }

        resolve();
      });
    });
  });
}

interface ExamResultRowDataPacket {
  student_exam_answers: StudentExamAnswersRowDataPacket;
  exam_grades: ExamGradesRowDataPacket;
}

interface StudentExamAnswersRowDataPacket {
  id: number;
  student_id: number;
  exam_id: number;
  question_id: number;
  answer_id: number;
}

interface ExamGradesRowDataPacket {
  id: number;
  exam_id: number;
  student_id: number;
  grade: number;
}

function buildQuestionSolution(packet: StudentExamAnswersRowDataPacket): QuestionSolutionOld {
  return {
    questionId: String(packet.question_id),
    answerId: String(packet.answer_id),
  };
}

function getStudentExamResults(examId: string, studentId: string): Promise<ExamResultOld|null> {
  return new Promise<ExamResultOld|null>((resolve, reject) => {
    getOneById(examId)
      .then((pureExam) => {
        if (pureExam === null) {
          resolve(null);
          return;
        }

        // get rid of creator
        const exam = pureExam;
        delete exam.creator;

        pool.getConnection((connectionError: Error|null, connection: PoolConnection) => {
          if (connectionError) {
            reject(connectionError);
            return;
          }

          connection.query({
            sql: `select * from student_exam_answers
            inner join exam_grades
              on exam_grades.student_id = student_exam_answers.student_id
              and exam_grades.exam_id = student_exam_answers.exam_id
            where
              student_exam_answers.exam_id = ? and
              student_exam_answers.student_id = ?`,
            values: [examId, studentId],
            nestTables: true,
          }, (queryError: Error|null, results: ExamResultRowDataPacket[]) => {
            if (queryError) {
              reject(queryError);
              return;
            }

            connection.release();

            if (results.length === 0) {
              resolve(null);
              return;
            }

            const grade = results[0].exam_grades.grade;
            const questionSolutions: QuestionSolutionOld[] = results
              .map((result) => buildQuestionSolution(result.student_exam_answers));

            if (exam === null) {
              reject(new Error('Exam is null'));
              return;
            }

            studentdb.getStudentById(studentId)
              .then((student: StudentOld|null) => {
                if (student === null) {
                  reject(new Error('Student is null but it should not be'));
                  return;
                }

                const examResult: ExamResultOld = {
                  student,
                  exam,
                  solution: questionSolutions,
                  grade,
                };

                resolve(examResult);
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

interface FullExamGradeRowDataPacket {
  exam_grades: ExamGradesRowDataPacket;
  students: StudentsRowDataPacket;
  accounts: AccountsRowDataPacket;
  specialties: SpecialtiesRowDataPacket;
}

function buildExamGrade(packet: FullExamGradeRowDataPacket): ExamGradeOld {
  const fullStudentPacket: FullStudentRowDataPacket = {
    accounts: packet.accounts,
    students: packet.students,
    specialties: packet.specialties,
  };

  const student = buildStudent(fullStudentPacket);

  return {
    examId: String(packet.exam_grades.exam_id),
    student,
    grade: packet.exam_grades.grade,
  };
}

function getExamGrades(examId: string): Promise<ExamGradeOld[]> {
  return new Promise<ExamGradeOld[]>((resolve, reject) => {
    pool.getConnection((connectionError: Error|null, connection: PoolConnection) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      connection.query({
        sql: `select * from exam_grades
        inner join students
          on students.id = exam_grades.student_id
        inner join accounts
          on accounts.id = students.account_id
        inner join specialties
          on specialties.id = students.specialty_id
        where exam_id = ?`,
        values: [examId],
        nestTables: true,
      }, (queryError: Error|null, results: FullExamGradeRowDataPacket[]) => {
        if (queryError) {
          reject(queryError);
          return;
        }

        connection.release();

        const grades = results.map((result) => buildExamGrade(result));
        resolve(grades);
      });
    });
  });
}

function hasSubmitted(examId: string, studentId: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    pool.getConnection((connectionError: Error|null, connection: PoolConnection) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      connection.query({
        sql: `select * from exam_grades
        where
          exam_grades.exam_id = ? and
          exam_grades.student_id = ?`,
        values: [examId, studentId],
      }, (queryError: Error|null, results: ExamGradesRowDataPacket[]) => {
        if (queryError) {
          reject(queryError);
          return;
        }

        connection.release();

        if (results.length === 0) {
          resolve(false);
          return;
        }

        resolve(true);
      });
    });
  });
}

export default {
  saveOne,

  saveStudentGrade,
  saveStudentSolution,

  getOneById,
  getExamBoundaries,

  getAllExams,
  getExamsBefore,
  getExamsAfter,

  getAllStudentExams,
  getStudentExamsBefore,
  getStudentExamsAfter,

  getAllExamInfos,
  getUpcomingExamInfos,

  getExamGrades,
  getStudentExamResults,

  hasSubmitted,
};
