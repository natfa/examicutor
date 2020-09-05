import { StrippedAnswerOld } from './StrippedAnswer';

export interface StrippedQuestionOld {
  id: string;
  text: string;
  answers: Array<StrippedAnswerOld>;
}
