import { Exam } from './Exam';
import { Student } from './Student';
import { QuestionSolution } from './QuestionSolution';

export interface ExamResult {
  student: Student;
  exam: Exam;
  solution: QuestionSolution[];
  grade: number;
}
