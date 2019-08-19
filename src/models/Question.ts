class Question {
  id: String | null;
  text: String;
  incorrectAnswers: Array<String>;
  correctAnswers: Array<String>;
  points: Number;
  subject: String;

  constructor (
    id: String | null = null,
    text: String,
    incorrectAnswers: Array<String>,
    correctAnswers: Array<String>,
    points: Number,
    subject: String,
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
