import { Course } from './Course';

export interface ExamGradeBoundary {
  course: Course;
  3: number;
  4: number;
  5: number;
  6: number;

  [gradeValue: number]: number;
}
