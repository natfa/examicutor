import { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';

import examdb from '../../db/exams';
import studentdb from '../../db/students';

import { ExamOld } from '../../models/Exam';
import { AnswerOld } from '../../models/Answer';
import { StrippedExamOld } from '../../models/StrippedExam';
import { StrippedQuestionOld } from '../../models/StrippedQuestion';
import { StrippedAnswerOld } from '../../models/StrippedAnswer';
import { StudentSolutionOld } from '../../models/StudentSolution';
import { QuestionOld } from '../../models/Question';
import { QuestionSolutionOld } from '../../models/QuestionSolution';

import { possibleGrades } from '../../constants';
import shuffle from '../../utils/shuffle';

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
function stripExam(exam: ExamOld|null): StrippedExamOld|null {
  if (exam === null) return null;

  const questions: StrippedQuestionOld[] = exam.questions.map((question) => {
    const answers: StrippedAnswerOld[] = question.answers.map((answer: AnswerOld) => {
      if (answer.id === undefined) throw new Error('Answer.id is undefined');
      const strippedAnswer: StrippedAnswerOld = {
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

/**
 * Shuffles the questions and their answers in preparation for exam solving.
 *
 * @param {StrippedExam|null} exam - The exam to be shuffled. The function doesn't mutate
 * the parameter. If null is passed as argument, null will be returned.
 *
 * @returns {StrippedExam|null} - A copy of the exam instance with shuffled questions
 * and answers. If null was passed as an argument, null will be returned.
 */
async function shuffleStrippedExam(exam: StrippedExamOld|null): Promise<StrippedExamOld|null> {
  if (exam === null) return null;

  const questionsWithShuffledAnswers = exam.questions.map((question) => {
    return {
      id: question.id,
      text: question.text,
      answers: shuffle(question.answers),
    };
  });

  const shuffledQuestions = shuffle(questionsWithShuffledAnswers);

  return {
    ...exam,
    questions: shuffledQuestions,
  };
}

function getExamById(req: Request, res: Response, next: NextFunction): void {
  const { examId } = req.params;

  examdb
    .getOneById(examId)
    .then(stripExam)
    .then(shuffleStrippedExam)
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

interface SolutionRequestBody {
  examId: string;
  solution: QuestionSolutionOld[];
}

/**
 * Calculates the points that the student gets based on the answers given.
 *
 * @param {Question[]} examQuestions - The questions that are in the exam.
 * @param {QuestionSolution[]} studentAnswers - The questionSolution objects
 * for each question that the student has answered.
 *
 * @returns {number} - The amount of points aquired for the student.
 */
function calculatePoints(examQuestions: QuestionOld[], studentAnswers: QuestionSolutionOld[]): number {
  const points = examQuestions.reduce((acc, question) => {
    const studentAnswer = studentAnswers.find((sa) => sa.questionId === question.id);
    const correctAnswer = question.answers.find((a) => a.correct);

    if (studentAnswer === undefined || studentAnswer === null) return acc;
    if (correctAnswer === undefined || correctAnswer === null) return acc;

    if (studentAnswer.answerId === correctAnswer.id) {
      return acc + question.points;
    }

    return acc;
  }, 0);

  return points;
}

/**
 * Checks the solution provided by the student,
 * calculates the points and assigns a grade for the exam to the student.
 *
 * @param {string} examId - The id of the exam being solved
 * @param {QuestionSolution} studentSolution - The solution provided by the student
 *
 * @returns {number|null} The grade received.
 * If the exam or its boundaries aren't found, null is returned instead
 */
async function _submitExam(
  studentSolution: StudentSolutionOld,
): Promise<number|null> {
  const exam = await examdb.getOneById(studentSolution.examId);

  if (exam === null) return null;

  const points = calculatePoints(exam.questions, studentSolution.solution);

  const examBoundaries = await examdb.getExamBoundaries(studentSolution.examId);

  if (examBoundaries.length === 0) {
    return null;
  }

  // get correct boundary for student
  const boundary = examBoundaries
    .find((boundary) => boundary.specialty.id === studentSolution.student.specialty.id);

  if (boundary === undefined || boundary === null) {
    return null;
  }

  let assignedGrade = 0;
  const sortedPossibleGrades = possibleGrades.sort((a, b) => b - a);

  sortedPossibleGrades.some((grade) => {
    if (points < boundary[grade]) return false;

    assignedGrade = grade;
    return true;
  });

  // persist solution and grade
  await Promise.all([
    examdb.saveStudentGrade(studentSolution.examId, studentSolution.student.id, assignedGrade),
    examdb.saveStudentSolution(studentSolution),
  ]);

  return assignedGrade;
}

async function submitExam(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.session === undefined) throw new Error('req.session is undefined');

  const {
    examId,
    solution,
  } = req.body as SolutionRequestBody;

  try {
    const student = await studentdb.getStudentByAccountId(req.session.account.id);

    if (student === null) {
      res.status(400).end();
      return;
    }

    const studentHasSubmitted = await examdb.hasSubmitted(examId, student.id);

    if (studentHasSubmitted) {
      res.status(400).end();
      return;
    }

    const studentSolution: StudentSolutionOld = {
      student,
      examId,
      solution,
    };

    const grade = await _submitExam(studentSolution);

    // this might be unnessesary
    res.status(204).json({ grade });
  } catch (err) {
    next(err);
  }
}

export default {
  getExamById,
  saveAnswer,
  submitExam,
}
