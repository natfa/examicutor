import { Dayjs } from 'dayjs';
import { Time } from './Time';
import { StrippedQuestion } from './StrippedQuestion';

export interface StrippedExam {
  id: string;
  name: string;
  startDate: Dayjs;
  timeToSolve: Time;
  questions: StrippedQuestion[];
}
