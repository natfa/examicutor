import { query } from './index'
import Answer from '../models/Answer'

function updateAnswer(answerId: string, text: string, correct: boolean): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    query({
      sql: `update answers set
      text = ?
      correct = ?
      where answers.id = ?`,
      values: [text, correct, answerId],
    })
      .then((results) => {
        if (results.affectedRows !== 1)
          return resolve(false)
        return resolve(true)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

function deleteAnswer(answerId: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    query({
      sql: `delete from answers
      where answers.id = ?`,
      values: [answerId],
    })
      .then((results) => {
        if (results.affectedRows !== 1)
          return resolve(false)
        return resolve(true)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

function saveAnswer(questionId: string, answer: Answer): Promise<Answer|null> {
  return new Promise<Answer|null>((resolve, reject) => {
    query({
      sql: `insert into answers
      (text, correct, questionid) values
      (?, ?, ?)`,
      values: [answer.text, answer.correct, questionId],
    })
      .then((results) => {
        if (results.affectedRows !== 1)
          return resolve(null)

        answer.id = results.insertId
        return resolve(answer)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export default {
  updateAnswer,
  deleteAnswer,
  saveAnswer,
}
