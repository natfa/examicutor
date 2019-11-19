import { Answer } from './Answer';
import { Subject } from './Subject';
import { Theme } from './Theme';

export interface Question {
  id?: string;
  text: string;
  points: number;
  subject: Subject;
  theme: Theme;
  answers: Array<Answer>;
}
