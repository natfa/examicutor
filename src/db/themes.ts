import { query } from './index'

const save = (subject: string, theme: string): Promise<string|null> => {
  return new Promise<string|null>((resolve, reject) => {
    query({ sql: 'select * from subjects where subjects.name = ?', values: [subject]})
      .then((results) => {
        if (results.length === 0)
          return resolve(null)

        const subject = { id: results[0].id, name: results[0].name }

        return query({
          sql: `insert into themes
          (name, subjectid) values
          (? , ?)`,
          values: [theme, subject.id],
        })
      })
      .then((results) => {
        if (!results)
          return

        if (results.affectedRows === 0)
          return resolve(null)
        if (results.affectedRows === 1)
          return resolve(theme)
        return reject(new Error('An inconsistency with the DB has occured, please double check'))
      })
  })
}

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
            return resolve(themes)
          })
      })
  })
}

const exists = (theme: string): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    query({
      sql: 'select * from themes where themes.name = ?',
      values: [theme],
    })
      .then((results) => {
        if (results.length === 0)
          return resolve(false)
        return resolve(true)
      })
  })
}

export default {
  getAllThemes,
  getThemesBySubject,
  exists,
  save,
}
