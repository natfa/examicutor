import { Student } from './Student';
import { QuestionSolution } from './QuestionSolution';

export interface StudentSolution {
  examId: string;

  student: Student;
  solution: QuestionSolution[];
}
