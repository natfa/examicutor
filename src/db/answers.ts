import { query } from './index'

import Answer from '../models/Answer'

const saveOne = async (answer: Answer, questionid: string): Promise<Answer> => {
  return new Promise<Answer>(async(resolve, reject) => {
    try {
      const answerInsertResult = await query({
        sql: `insert into answers
        (text, correct, questionid) values
        (?, ?, ?)`,
        values: [answer.text, answer.correct, questionid],
      })

      return resolve(new Answer(
        String(answerInsertResult.insertId),
        answer.text,
        Boolean(answer.correct),
      ))
    }
    catch(err) {
      return reject(err)
    }
  })
}

const getManyByQuestionid = async (questionid: string): Promise<Array<Answer>> => {
  return new Promise<Array<Answer>>(async(resolve, reject) => {
    try {
      const results = await query({
        sql: `select id, text, correct
        from answers
        where answers.questionid = ?`,
        values: [questionid],
      })

      const array = results.map((result: any) => {
        return new Answer(
          String(result.id),
          result.text,
          Boolean(result.correct)
        )
      })

      return resolve(array)
    }
    catch(err) {
      return resolve(err)
    }
  })
}

export default {
  saveOne,
  getManyByQuestionid,
}
