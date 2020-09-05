import { SpecialtyOld } from './Specialty';

export interface ExamGradeBoundaryOld {
  specialty: SpecialtyOld;
  3: number;
  4: number;
  5: number;
  6: number;

  [gradeValue: number]: number;
}
