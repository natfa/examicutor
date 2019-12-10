import examController from './exam';

import { QuestionSolution } from '../models/QuestionSolution';

import { possibleGrades } from '../constants';

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
async function submitExam(
  examId: string,
  studentSolution: QuestionSolution[],
): Promise<number|null> {
  const exam = await examController.getExamById(examId);

  if (exam === null) return null;

  const points = exam.questions.reduce((acc, question) => {
    const solution = studentSolution.find((s) => s.questionId === question.id);
    if (solution === undefined) return acc;

    const correctAnswer = question.answers.find((answer) => answer.correct);
    if (correctAnswer === undefined) return acc;

    if (solution.answerId === correctAnswer.id) {
      return acc + question.points;
    }

    return acc;
  }, 0);

  const examBoundaries = await examController.getExamBoundaries(examId);

  if (examBoundaries.length === 0) {
    return null;
  }

  // TODO: This needs to be fixed in the future,
  // when you can identify which student is in which specialty
  const boundary = examBoundaries[0];

  const sortedPossibleGrades = possibleGrades.sort((a, b) => b - a);
  let assignedGrade = 0;

  sortedPossibleGrades.some((grade) => {
    if (points < boundary[grade]) return false;

    assignedGrade = grade;
    return true;
  });

  return assignedGrade;
}

export default {
  submitExam,
};
