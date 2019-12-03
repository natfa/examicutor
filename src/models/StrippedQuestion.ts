import { StrippedAnswer } from './StrippedAnswer';

export interface StrippedQuestion {
  id: string;
  text: string;
  answers: Array<StrippedAnswer>;
}
