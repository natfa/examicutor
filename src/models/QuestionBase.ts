import { Subject } from './Subject';
import { Theme } from './Theme';
import { Answer } from './Answer';

export interface QuestionBase {
  id: string;
  text: string;
  points: number;
  subject: Subject;
  theme: Theme;
  answers: Answer[];
}
