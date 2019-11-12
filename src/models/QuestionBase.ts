import Subject from './Subject';
import Theme from './Theme';

interface QuestionBase {
  id: string;
  text: string;
  points: number;
  subject: Subject;
  theme: Theme;
}

export default QuestionBase;
