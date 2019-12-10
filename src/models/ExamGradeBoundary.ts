import { Specialty } from './Specialty';

export interface ExamGradeBoundary {
  specialty: Specialty;
  3: number;
  4: number;
  5: number;
  6: number;

  [gradeValue: number]: number;
}
