import Question from './Question';

class Test {
  name: String;
  questions: Array<Question>;

  constructor (
    name: String,
    questions: Array<Question>,
  ) {
    this.name = name;
    this.questions = questions;
  }

  publish () {
    const questions = this.questions.map((question) => {
      return {
        text: question.text,
        answers: [...question.incorrectAnswers, ...question.correctAnswers],
      }
    })

    return {
      name: this.name,
      questions: [...questions]
    }
  }
}

export default Test;
