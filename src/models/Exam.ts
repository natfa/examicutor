import Time from './Time';
import QuestionBase from './QuestionBase';
import Account from './Account';

interface Exam {
  name: string;
  startDate: Date;
  endDate: Date;
  timeToSolve: Time;
  questions: Array<QuestionBase>;
  creator: Account;
}

export default Exam;
