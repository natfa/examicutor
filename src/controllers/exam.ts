import { StrippedAnswer } from '../models/StrippedAnswer';
import { StrippedQuestion } from '../models/StrippedQuestion';
import { Exam } from '../models/Exam';
import { StrippedExam } from '../models/StrippedExam';
import { ExamGradeBoundary } from '../models/ExamGradeBoundary';

import examdb from '../db/exams';

/**
 * Tries to find an exam with an id.
 *
 * @param {string} id - The id to search with.
 *
 * @returns {Exam|null} - An exam object if found, otherwise null
 */
async function getExamById(id: string): Promise<Exam|null> {
  const exam = await examdb.getOneById(id);

  if (exam === null) return null;

  // get rid of the password hash
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
 *  @param {Exam} The exam to be stripped
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

export default {
  getExamById,
  stripExam,
  getExamBoundaries,
};
