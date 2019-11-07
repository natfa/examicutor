class Theme {
  id: string|undefined|null;

  name: string;

  subjectid: string;

  constructor(
    id: string|undefined|null,
    name: string,
    subjectid: string,
  ) {
    this.id = id;
    this.name = name;
    this.subjectid = subjectid;
  }
}

export default Theme;
