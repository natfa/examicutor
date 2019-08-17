class Question {
  id: String | null;
  text: String;
  incorrectAnswers: Array<String>;
  correctAnswers: Array<String>;
  points: Number;

  constructor (
    id: String | null = null,
    text: String,
    incorrectAnswers: Array<String>,
    correctAnswers: Array<String>,
    points: Number,
  ) {
    this.id = id;
    this.text = text;
    this.incorrectAnswers = incorrectAnswers;
    this.correctAnswers = correctAnswers;
    this.points = points;
  }
}

export default Question;
