import { QuestionSolution } from './QuestionSolution';

export interface StudentSolution {
  studentId: string;
  examId: string;

  solution: QuestionSolution[];
}
