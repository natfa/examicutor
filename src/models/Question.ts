class Question {
  text: String;
  incorrectAnswers: Array<String>;
  correctAnswers: Array<String>;
  points: Number;
  subject: any;
  media: any;

  constructor (
    text: String,
    incorrectAnswers: Array<String>,
    correctAnswers: Array<String>,
    points: Number,
    subject: any,
    media: any,
  ) {
    this.text = text;
    this.incorrectAnswers = incorrectAnswers;
    this.correctAnswers = correctAnswers;
    this.points = points;
    this.subject = subject;
    this.media = media;
  }
}

export default Question;