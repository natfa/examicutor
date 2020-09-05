import { StudentOld } from './Student';
import { QuestionSolutionOld } from './QuestionSolution';

export interface StudentSolutionOld {
  examId: string;

  student: StudentOld;
  solution: QuestionSolutionOld[];
}
