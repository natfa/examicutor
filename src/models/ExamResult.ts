import { Exam } from './Exam';
import { QuestionSolution } from './QuestionSolution';

export interface ExamResult {
  studentId: string;
  exam: Exam;
  solution: QuestionSolution[];
  grade: number;
}
