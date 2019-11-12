import Answer from './Answer';
import Subject from './Subject';
import Theme from './Theme';

interface Question {
  id?: string;
  text: string;
  answers: Array<Answer>;
  points: number;
  subject: Subject;
  theme: Theme;
  media: Array<Buffer>;
}

export default Question;
