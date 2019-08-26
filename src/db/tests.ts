import pool from './index'

import Test from '../models/Test'
import Question from '../models/Question'

const saveTest = (test: Test): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err)
        throw err

      connection.query({
        sql: `insert into tests
        (name, timetosolve, start, end) values
        (?, ?, ?, ?)`,
        values: [test.name, test.timeToSolve, test.start, test.end]
      }, (err, results, fields) => {
        if (err)
          throw err

        if (results.affectedRows !== 1) {
          connection.release()
          reject(new Error('More or less than one row affected, please contact a system administrator'))
        }

        test.id = results.insertId

        test.questions.map((question: Question) => {
          connection.query({
            sql: `insert into test_questions
            (testid, questionid) values
            (?, ?)`,
            values: [test.id, question.id],
          }, (err, results, fields) => {
            if (err)
              throw err
          })
        })

        connection.release()
        return resolve(true)
      })
    })
  })
}

export default {
  saveTest,
}
