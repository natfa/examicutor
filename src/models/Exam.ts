import { Dayjs } from 'dayjs';
import { Time } from './Time';
import { Question } from './Question';
import { Account } from './Account';

export interface Exam {
  id?: string;
  name: string;
  startDate: Dayjs;
  endDate: Dayjs;
  timeToSolve: Time;
  questions: Question[];
  creator: Account;
}
