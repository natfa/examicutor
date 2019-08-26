import pool from './index';

const getAllSubjects = (): Promise<Array<String>> => {
  return new Promise<Array<String>>((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err)
        throw err

      connection.query({
        sql: `select * from subjects`,
      }, (err, results, fields) => {
        connection.release()
        if (err)
          throw err

        const subjects = results.map((result: any) => result.name)

        resolve(subjects)
      })
    })
  })
}

export default {
  getAllSubjects,
}
