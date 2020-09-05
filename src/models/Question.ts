import { AnswerOld } from './Answer';
import { SubjectOld } from './Subject';
import { ThemeOld } from './Theme';

export interface QuestionOld {
  id?: string;
  text: string;
  points: number;
  subject: SubjectOld;
  theme: ThemeOld;
  answers: Array<AnswerOld>;
}
