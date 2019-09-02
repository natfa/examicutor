import { query } from './index'
import Question from '../models/Question'


function getAllQuestions():Promise<Array<Question>> {
  return new Promise<Array<Question>>((resolve, reject) => {
    let questions: Array<Question> = []

    query({ sql: 'select * from questions' })
      .then((results) => {
        results.map((result: any) => {
          const question = new Question(
            String(result.id),
            result.text,
            [],
            [],
            result.points,
            'SUBJECT THAT I MADE UP',
            [],
          )

          questions = [...questions, question]
        })

        return query({ sql: 'select * from answers' })
      })
      .then((results) => {
        results.map((result: any) => {
          const question = questions.find(q => q.id === String(result.questionid))
          if (!question)
            return

          if (result.correct)
            question.correctAnswers = [...question.correctAnswers, result.text]
          else
            question.incorrectAnswers = [...question.incorrectAnswers, result.text]
        })

        return query({ sql: 'select * from media' })
      })
      .then((results) => {
        results.map((result: any) => {
          const question = questions.find(q => q.id === String(result.questionid))
          if (!question)
            return

          question.media = [...question.media, result.content]
        })
        return resolve(questions)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}


function getQuestionById(questionId: string): Promise<Question|null> {
  let question: Question

  return new Promise<Question|null>((resolve, reject) => {
    query({
      sql: `select q.*, a.*
      from questions q
      inner join answers a
      on q.id = a.questionid
      where q.id = ?`,
      values: [questionId],
      nestTables: true,
    })
      .then((results) => {
        if (results.length === 0)
          return resolve(null)

        question = new Question(
          String(results[0].q.id),
          results[0].q.text,
          [], [],
          results[0].q.points,
          'Implement subjects',
          []
        )

        results.map((result: any) => {
          if (result.a.correct)
            question.correctAnswers = [...question.correctAnswers, result.a.text]
          else
            question.incorrectAnswers = [...question.incorrectAnswers, result.a.text]
        })

        return query({
          sql: 'select * from media where media.questionid = ?',
          values: [questionId],
        })
      })
      .then((results) => {
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


function getQuestionsBySubjects(...subjects: Array<string>):Promise<Array<Question>> {
  return new Promise<Array<Question>>((resolve, reject) => {
    return reject(new Error('Not implemented'))
  })
}


const saveQuestion = (question: Question): Promise<Question> => {
  return new Promise<Question>((resolve, reject) => {
    const answers: Array<any> = [
      ...question.incorrectAnswers.map(answer => ({ text: answer, correct: false })),
      ...question.correctAnswers.map(answer => ({ text: answer, correct: true }))
    ]

    query({
      sql: 'insert into questions(text, points) values(?, ?)',
      values: [question.text, question.points],
    })
      .then((results) => {
        question.id = results.insertId;

        answers.map((answer) => {
          query({
            sql: 'insert into answers(text, correct, questionid) values(?, ?, ?)',
            values: [answer.text, answer.correct, question.id],
          })
        })

        question.media.map((blob) => {
          query({
            sql: 'insert into media(questionid, content) values (?, ?)',
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


const updateQuestionById = (questionId: string, update: any): Promise<Question|null> => {
  return new Promise<Question|null>((resolve, reject) => {
  });
}


// TODO: Make the deletion cascade as well
const removeQuestionById = (questionId: string): Promise<Question|null> => {
  return new Promise<Question|null>((resolve, reject) => {
    query({ sql: 'delete from questions where id = ?', values: [questionId] })
      .then((results) => {
        if (results.affectedRows === 0)
          return reject(new Error('No affected rows, please contact developers'))
        else if (results.affectedRows === 1)
          return resolve(null)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}


export default {
  getAllQuestions,
  getQuestionById,
  getQuestionsBySubjects,
  saveQuestion,
  updateQuestionById,
  removeQuestionById,
}
