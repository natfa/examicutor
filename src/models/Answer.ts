class Answer {
  id: string|null
  text: string
  correct: boolean

  constructor(
    id: string|null,
    text: string,
    correct: boolean,
  ) {
    this.id = id
    this.text = text
    this.correct = correct
  }
}

export default Answer
