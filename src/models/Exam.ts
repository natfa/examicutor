import { Dayjs } from 'dayjs';
import { Time } from './Time';
import { QuestionBase } from './QuestionBase';
import { Account } from './Account';

export interface Exam {
  id?: string;
  name: string;
  startDate: Dayjs;
  endDate: Dayjs;
  timeToSolve: Time;
  questions: Array<QuestionBase>;
  creator: Account;
}
