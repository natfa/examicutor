import { query } from './index'

import Question from '../models/Question'
import { IQuestionFilters } from '../models/IQuestionFilters'
import Answer from '../models/Answer'


function getAll(filters?: IQuestionFilters): Promise<Array<Question>> {
  return new Promise<Array<Question>>((resolve, reject) => {
    let questions: Array<Question> = []
    let sql = `select
      q.id as id,
      q.text as text,
      q.points as points,
      s.name as subject,
      t.name as theme
      from questions q
      left join subjects s on q.subjectid = s.id
      left join themes t on q.themeid = t.id`
    let values: Array<any> = []

    if (filters) {
      sql += ` where s.name = ?`
      values = [...values, filters.subject]

      if (filters.text) {
        sql +=  ` and q.text like ?`
        values = [...values, `%${filters.text}%`]
      }
    }

    query({ sql, values })
      .then((results) => {
        results.map((result: any) => {
          const question = new Question(
            String(result.id),
            result.text,
            [],
            result.points,
            result.subject,
            result.theme,
            [],
          )
          questions = [...questions, question]
        })

        return resolve(questions)
      })
      .catch((err) => {
        console.log(err)
        return reject(err)
      })
  })
}


function getById(questionId: string): Promise<Question|null> {
  let question: Question

  return new Promise<Question|null>((resolve, reject) => {
    query({
      sql: `select
      q.id as id,
      q.text as text,
      q.points as points,
      s.name as subject,
      t.name as theme
      from questions q
      left join subjects s on q.subjectid = s.id
      left join themes t on q.themeid = t.id
      where q.id = ?`,
      values: [questionId],
    })
      .then((results) => {
        if (results.length === 0)
          return resolve(null)

        const result = results[0]
        question = new Question(
          String(result.id),
          result.text,
          [],
          result.points,
          result.subject,
          result.theme,
          []
        )

        return query({
          sql: `select
          a.id as id,
          a.text as text,
          a.correct as correct
          from answers a
          inner join questions q on a.questionid = q.id
          where q.id = ?`,
          values: [questionId],
        })
      })
      .then((results) => {
        if (!results)
          return

        results.map((result: any) => {
          const answer = new Answer(String(result.id), result.text, Boolean(result.correct))
          question.answers = [...question.answers, answer]
        })

        return query({
          sql: 'select * from media where media.questionid = ?',
          values: [questionId],
        })
      })
      .then((results) => {
        if (!results)
          return

        results.map((result: any) => {
          question.media = [...question.media, result.content]
        })

        return resolve(question)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

function save(question: Question): Promise<Question|null> {
  return new Promise<Question|null>((resolve, reject) => {
    let sqlquery
    let values

    if (question.theme !== null) {
      sqlquery = `select
      s.id as subjectid,
      t.id as themeid
      from subjects s
      left join themes t on t.subjectid = s.id
      where s.name = ?
      and t.name = ?`
      values = [question.subject, question.theme]
    } else {
      sqlquery = `select
      s.id as subjectid
      from subjects s
      where s.name = ?`
      values = [question.subject]
    }

    query({
      sql: sqlquery,
      values: [...values]
    })
      .then((results) => {
        if (results.length < 1)
          return resolve(null)

        const subjectid = results[0].subjectid || null
        const themeid = results[0].themeid || null

        return query({
          sql: `insert into questions
          (text, points, subjectid, themeid) values
          (?, ?, ?, ?)`,
          values: [question.text, question.points, subjectid, themeid]
        })
      })
      .then((results) => {
        if (!results)
          return

        if (results.affectedRows !== 1)
          return resolve(null)

        question.id = results.insertId

        question.answers.map((answer) => {
          query({
            sql: `insert into answers (text, correct, questionid)
            values (?, ?, ?)`,
            values: [answer.text, answer.correct, question.id],
          })
        })

        question.media.map((blob) => {
          query({
            sql: `insert into media (questionid, content)
            values (?, ?)`,
            values: [question.id, blob],
          })
        })

        return resolve(question)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

function deleteById(questionId: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    query({
      sql: 'delete from questions where id = ?',
      values: [questionId],
    })
      .then((results) => {
        if (results.affectedRows === 0)
          return resolve(false)
        else if (results.affectedRows === 1)
          return resolve(true)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export default {
  getAll,
  getById,
  save,
  deleteById,
}
