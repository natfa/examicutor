import { Student } from './Student';

export interface ExamGrade {
  examId: string;
  student: Student;
  grade: number;
}
