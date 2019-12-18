import dayjs from 'dayjs';

import { StrippedAnswer } from '../models/StrippedAnswer';
import { StrippedQuestion } from '../models/StrippedQuestion';
import { Exam } from '../models/Exam';
import { ExamInfo } from '../models/ExamInfo';
import { StrippedExam } from '../models/StrippedExam';
import { ExamGradeBoundary } from '../models/ExamGradeBoundary';
import { ExamResult } from '../models/ExamResult';
import { ExamGrade } from '../models/ExamGrade';

import examdb from '../db/exams';

/**
 * Fetches and returns an exam by its ID.
 *
 * @param {string} id - The id to search with.
 *
 * @returns {Exam|null} The exam info and the questions for that exam
 */
async function getExamById(id: string): Promise<Exam|null> {
  const exam = await examdb.getOneById(id);

  if (exam === null) return null;

  // never send out passwordhash
  delete exam.creator.passwordHash;

  return exam;
}

/**
 * Strips an exam from all fields that aren't supposed to be sent when an exam is being solved.
 * That includes:
 *  - removing the correct property from each answer
 *  - removing points, theme and subjet properties from each question
 *  - removing the endDate and creator properties from the exam
 *
 *  @param {Exam} exam - The exam to be stripped
 *
 *  @returns {StrippedExam} The same exam with less properties
 */
function stripExam(exam: Exam|null): StrippedExam|null {
  if (exam === null) return null;

  const questions: StrippedQuestion[] = exam.questions.map((question) => {
    const answers: StrippedAnswer[] = question.answers.map((answer) => {
      if (answer.id === undefined) throw new Error('Answer.id is undefined');
      const strippedAnswer: StrippedAnswer = {
        id: answer.id,
        text: answer.text,
      };

      return strippedAnswer;
    });

    if (question.id === undefined) throw new Error('Question.id is undefined');

    return {
      id: question.id,
      text: question.text,
      answers,
    };
  });

  if (exam.id === undefined) throw new Error('Exam.id is undefined');

  return {
    id: exam.id,
    name: exam.name,
    startDate: exam.startDate,
    timeToSolve: exam.timeToSolve,
    questions,
  };
}

async function getExamBoundaries(examId: string): Promise<ExamGradeBoundary[]> {
  const examBoundaries = await examdb.getExamBoundaries(examId);

  return examBoundaries;
}

/**
 * Fetches all exams saved in the database.
 *
 * @param {string|undefined} studentId - if this parameter is passed, the exams are going
 * to be filtered for the specified student
 *
 * @returns {ExamInfo[]} All exams saved on the database.
 */
async function getAllExams(studentId?: string): Promise<ExamInfo[]> {
  if (studentId !== undefined) return examdb.getAllStudentExams(studentId);

  return examdb.getAllExams();
}

/**
 * Fetches and returns exams that have an end date that is after current time.
 *
 * @param {string|undefined} studentId - if this parameter is passed, the exams are going
 * to be filtered for the specified student
 *
 * @returns {ExamInfo[]} All exams that have an end date after current time.
 */
async function getUpcomingExams(studentId?: string): Promise<ExamInfo[]> {
  const now = dayjs();

  if (studentId !== undefined) return examdb.getStudentExamsAfter(studentId, now);
  return examdb.getExamsAfter(now);
}

/**
 * Fetches and returns exams that have an end date that is past current time.
 *
 * @param {string|undefined} studentId - if this parameter is passed, the exams are going
 * to be filtered for the specified student
 *
 * @returns {ExamInfo[]} All exams that have an end date past current time.
 */
async function getPastExams(studentId?: string): Promise<ExamInfo[]> {
  const now = dayjs();

  if (studentId !== undefined) return examdb.getStudentExamsBefore(studentId, now);
  return examdb.getExamsBefore(now);
}

/**
 * Fetches the exam results for the specified student.
 *
 * @param {string} examId - The exam ID
 * @param {string} studentId - The student ID
 *
 * @returns {ExamResult|null} - The grade and given answers for the exam.
 */
async function getStudentExamResults(examId: string, studentId: string): Promise<ExamResult|null> {
  const examResult = await examdb.getStudentExamResults(examId, studentId);

  return examResult;
}

/**
 * Fetches all grades for a completed exam.
 *
 * @param {string} examId - The ID of the exam.
 *
 * @returns {ExamGrade[]} - The grades for all participating students in the exam.
 */
async function getExamGrades(examId: string): Promise<ExamGrade[]> {
  const grades = await examdb.getExamGrades(examId);

  return grades;
}

export default {
  getExamById,

  getAllExams,

  getUpcomingExams,
  getPastExams,

  stripExam,
  getExamBoundaries,

  getExamGrades,
  getStudentExamResults,
};
