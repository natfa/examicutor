import { ExamOld } from './Exam';
import { StudentOld } from './Student';
import { QuestionSolutionOld } from './QuestionSolution';

export interface ExamResultOld {
  student: StudentOld;
  exam: ExamOld;
  solution: QuestionSolutionOld[];
  grade: number;
}
