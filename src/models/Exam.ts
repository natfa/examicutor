import { Dayjs } from 'dayjs';
import { TimeOld } from './Time';
import { QuestionOld } from './Question';
import { AccountOld } from './Account';

export interface ExamOld {
  id?: string;
  name: string;
  startDate: Dayjs;
  endDate: Dayjs;
  timeToSolve: TimeOld;
  questions: QuestionOld[];
  creator: AccountOld;
}
