import { Subject } from './Subject';
import { Theme } from './Theme';

export interface QuestionBase {
  id: string;
  text: string;
  points: number;
  subject: Subject;
  theme: Theme;
}
