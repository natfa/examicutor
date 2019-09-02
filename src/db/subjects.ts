import { query } from './index'

const getAllSubjects = (): Promise<Array<String>> => {
  return new Promise<Array<String>>((resolve, reject) => {
    query({ sql: 'select * from subjects' })
      .then((results) => {
        const subjects = results.map((result: any) => result.name)

        resolve(subjects)
      })
  })
}

export default {
  getAllSubjects,
}
