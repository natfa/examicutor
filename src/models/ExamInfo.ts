import { Dayjs } from 'dayjs';
import { Time } from './Time';

export interface ExamInfo {
  id: string;
  name: string;
  startDate: Dayjs;
  endDate: Dayjs;
  timeToSolve: Time;
}
