import { query } from './index'

import answerdb from './answers'
import mediadb from './media'
import subjectdb from './subjects'
import themedb from './themes'

import Question, { QuestionBase } from '../models/Question'
import Subject from '../models/Subject'
import Theme from '../models/Theme'

const saveOne = async (question: Question): Promise<Question> => {
  return new Promise<Question>(async(resolve, reject) => {
    try {
      const questionInsertResult = await query({
        sql: `insert into questions
        (text, points, subjectid, themeid) values
        (?, ?, ?, ?)`,
        values: [question.text, question.points, question.subject.id, question.theme.id],
      })

      const questionid = String(questionInsertResult.insertId)
      const answers = await Promise.all(question.answers.map(a => answerdb.saveOne(a, questionid)))
      await Promise.all(question.media.map(m => mediadb.saveOne(m, questionid)))

      return resolve(new Question(
        String(questionInsertResult.insertId),
        question.text,
        answers,
        question.points,
        question.subject,
        question.theme,
        question.media,
      ))

    }
    catch(err) {
      return reject(err)
    }
  })
}

const getOneById = async (id: string): Promise<Question|null> => {
  return new Promise<Question|null>(async(resolve, reject) => {
    try {
      const results = await query({
        sql: `select id, text, points, subjectid, themeid
        from questions
        where questions.id = ?`,
        values: [id],
      })

      if (results.length === 0)
        return resolve(null)

      const questionResult = results[0]

      const [subject, theme] = await Promise.all([
        subjectdb.getOneById(questionResult.subjectid),
        themedb.getOneById(questionResult.themeid)
      ])

      if (subject === null || theme === null)
        return resolve(null)

      const [answers, media] = await Promise.all([
        answerdb.getManyByQuestionid(String(questionResult.id)),
        mediadb.getManyByQuestionid(questionResult.id),
      ])

      const question = new Question(
        String(questionResult.id),
        questionResult.text,
        answers,
        questionResult.points,
        subject,
        theme,
        media,
      )
    }
    catch(err) {
      return reject(err)
    }
  })
}

const getAll = (): Promise<Array<QuestionBase>> => {
  return new Promise<Array<QuestionBase>>(async(resolve, reject) => {
    try {
      const results = await query({
        sql: `select
        q.id as id,
        q.text as text,
        q.points as points,
        s.id as subjectid,
        s.name as subject,
        t.id as themeid,
        t.name as theme
        from questions q
        inner join subjects s
          on q.subjectid = s.id
        inner join themes t
          on q.themeid = t.id`
      })

      const questions = results.map((result: any) => {
        return new QuestionBase(
          String(result.id),
          result.text,
          result.points,
          new Subject(String(result.subjectid), result.subject),
          new Theme(String(result.themeid), result.theme, String(result.subjectid)),
        )
      })

      return resolve(questions)
    }
    catch(err) {
      return reject(err)
    }
  })
}

const deleteOneById = (id: string): Promise<boolean> => {
  return new Promise<boolean>(async(resolve, reject) => {
    try {
      const result = await query({
        sql: `delete from questions where id = ?`,
        values: [id],
      })

      if (result.affectedRows === 0)
        return resolve(false)
      return resolve(true)
    }
    catch(err) {
      return reject(err)
    }
  })
}

const getManyBySubjectid = (subjectid: string): Promise<Array<QuestionBase>> => {
  return new Promise<Array<QuestionBase>>(async(resolve, reject) => {
    try {
      const results = await query({
        sql: `select
        q.id as id,
        q.text as text,
        q.points as points,
        s.id as subjectid,
        s.name as subject,
        t.id as themeid,
        t.name as theme
        from questions q
        inner join subjects s
          on q.subjectid = s.id
        inner join themes t
          on q.themeid = t.id
        where q.subjectid = ?`,
        value: [subjectid]
      })

      const questions = results.map((result: any) => {
        return new QuestionBase(
          String(result.id),
          result.text,
          result.points,
          new Subject(String(result.subjectid), result.subject),
          new Theme(String(result.themeid), result.theme, String(result.subjectid)),
        )
      })
    }
    catch(err) {
      return reject(err)
    }
  })
}

export default {
  saveOne,
  getOneById,
  getAll,
  getManyBySubjectid,
  deleteOneById,
}
