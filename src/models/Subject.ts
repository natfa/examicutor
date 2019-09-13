class Subject {
  id: string|undefined|null
  name: string

  constructor(
    id: string|undefined|null,
    name: string,
  ) {
    this.id = id
    this.name = name
  }
}

export default Subject
