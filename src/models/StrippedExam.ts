import { Dayjs } from 'dayjs';
import { TimeOld } from './Time';
import { StrippedQuestionOld } from './StrippedQuestion';

export interface StrippedExamOld {
  id: string;
  name: string;
  startDate: Dayjs;
  timeToSolve: TimeOld;
  questions: StrippedQuestionOld[];
}
