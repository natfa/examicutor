class Question {
  id: string | null;
  text: string;
  incorrectAnswers: Array<string>;
  correctAnswers: Array<string>;
  points: number;
  subject: string;

  constructor (
    id: string | null = null,
    text: string,
    incorrectAnswers: Array<string>,
    correctAnswers: Array<string>,
    points: number,
    subject: string,
  ) {
    this.id = id;
    this.text = text;
    this.incorrectAnswers = incorrectAnswers;
    this.correctAnswers = correctAnswers;
    this.points = points;
    this.subject = subject;
  }
}

export default Question;
