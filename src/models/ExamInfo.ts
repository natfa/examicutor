import { Dayjs } from 'dayjs';
import { TimeOld } from './Time';

export interface ExamInfoOld {
  id: string;
  name: string;
  startDate: Dayjs;
  endDate: Dayjs;
  timeToSolve: TimeOld;
}
