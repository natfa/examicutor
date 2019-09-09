import { query } from './index'

const getAllThemes = (): Promise<Array<string>> => {
  return new Promise<Array<string>>((resolve, reject) => {
    query({ sql: 'select * from themes' })
      .then((results) => {
        const themes = results.map((result: any) => result.name)

        resolve(themes)
      })
  })
}

const getThemesBySubject = (subject: string): Promise<Array<string>> => {
  return new Promise<Array<string>>((resolve, reject) => {
    query({ sql: 'select * from subjects' })
      .then((results) => {
        const subjectResult = results.find((result: any) => result.name === subject)

        if (!subjectResult) {
          return resolve([])
        }

        query({
          sql: 'select * from themes where themes.subjectid = ?',
          values: [subjectResult.id],
        })
          .then((results) => {
            const themes = results.map((result: any) => result.name)
          })
      })
  })
}

export default {
  getAllThemes,
  getThemesBySubject,
}
