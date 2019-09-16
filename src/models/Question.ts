import Answer from './Answer'
import Subject from './Subject'
import Theme from './Theme'

class Question {
  id: string|null|undefined
  text: string
  answers: Array<Answer>
  points: number
  subject: Subject
  theme: Theme
  media: Array<Buffer>

  constructor (
    id: string|null|undefined,
    text: string,
    answers: Array<Answer>,
    points: number,
    subject: Subject,
    theme: Theme,
    media: Array<Buffer>,
  ) {
    this.id = id
    this.text = text
    this.answers = answers
    this.points = points
    this.subject = subject
    this.theme = theme
    this.media = media
  }
}

export class QuestionBase {
  id: string
  text: string
  points: number
  subject: Subject
  theme: Theme

  constructor(
    id: string,
    text: string,
    points: number,
    subject: Subject,
    theme: Theme,
  ) {
    this.id = id
    this.text = text
    this.points = points
    this.subject = subject
    this.theme = theme
  }
}

export default Question
