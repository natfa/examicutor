import Question from './Question'
import Answer from './Answer'

class Test {
  id: string|undefined
  name: string
  questions: Array<Question>
  timeToSolve: Date
  start: Date
  end: Date

  constructor (
    id: string|undefined,
    name: string,
    questions: Array<Question>,
    timeToSolve: Date,
    start: Date,
    end: Date,
  ) {
    this.id = id
    this.name = name
    this.questions = questions
    this.timeToSolve = timeToSolve
    this.start = start
    this.end = end
  }

  publish () {
    const questions: any = this.questions.map((question) => {
      return {
        id: question.id,
        text: question.text,
        answers: [...questions.answers.map((answer: Answer) => answer.text)],
        media: question.media,
      }
    })

    return {
      name: this.name,
      questions: [...questions]
    }
  }
}

export default Test
