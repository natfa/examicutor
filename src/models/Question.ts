import Answer from './Answer'

class Question {
  id: string|null
  text: string
  answers: Array<Answer>
  points: number
  subject: string
  theme: string|null
  media: Array<Buffer>

  constructor (
    id: string|null = null,
    text: string,
    answers: Array<Answer>,
    points: number,
    subject: string,
    theme: string|null,
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

export default Question
