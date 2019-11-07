import Subject from './Subject';
import Theme from './Theme';

class QuestionBase {
  id: string;

  text: string;

  points: number;

  subject: Subject;

  theme: Theme;

  constructor(
    id: string,
    text: string,
    points: number,
    subject: Subject,
    theme: Theme,
  ) {
    this.id = id;
    this.text = text;
    this.points = points;
    this.subject = subject;
    this.theme = theme;
  }
}

export default QuestionBase;
