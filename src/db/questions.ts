import { query } from './index'
import Question from '../models/Question'
import Answer from '../models/Answer'


function getAllQuestions(): Promise<Array<Question>> {
  return new Promise<Array<Question>>((resolve, reject) => {
    let questions: Array<Question> = []

    query({
      sql: `select
      q.id as id,
      q.text as text,
      q.points as points,
      s.name as subject,
      t.name as theme
      from questions q
      left join subjects s on q.subjectid = s.id
      left join themes t on q.themeid = t.id`
    })
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

        return query({
          sql: `select
          id, text, correct, questionid
          from answers`
        })
      })
      .then((results) => {
        results.map((result: any) => {
          const question = questions.find(q => q.id === String(result.questionid))
          if (!question)
            return

          const answer = new Answer(String(result.id), result.text, result.correct)
          question.answers = [...question.answers, answer]
        })

        return query({ sql: `select content, questionid from media` })
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
          const answer = new Answer(String(result.id), result.text, result.correct)
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

function saveQuestion(question: Question): Promise<Question|null> {
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

function removeQuestionById(questionId: string): Promise<boolean> {
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

function updateQuestionById(question: Question): Promise<Question|null> {
  if (question.id === null || question.id === undefined) {
    throw new Error(`Question doesn't have an id`)
  }

  return new Promise<Question|null>((resolve, reject) => {
    const answersToBeInserted = question.answers.filter(answer => answer.id === null)

    query({
      sql: `select id, text, correct
      from answers a
      where a.questionid = ?`,
      values: [question.id],
    })
      .then((results) => {
        const answersInDb: Array<Answer> = results.map((result: any) => {
          new Answer(String(result.id), result.text, result.correct)
        })

        // Update and delete existing answers
        answersInDb.map((dbAnswer: Answer) => {
          const modelAnswer = question.answers.find((a) => a.id === dbAnswer.id)

          if (!modelAnswer)
            return query({ sql: 'delete from answers where answers.id = ?', values: [dbAnswer.id] })

          if (modelAnswer.text !== dbAnswer.text || modelAnswer.correct !== dbAnswer.correct)
            return query({
              sql: 'update answers set text = ?, correct = ? where answers.id = ?',
              values: [dbAnswer.id]
            })
        })

        // Insert new answers
        answersToBeInserted.map((answer: Answer) => {
          query({
            sql: 'insert into answers(text, correct) values (?, ?)',
            values: [answer.text, answer.correct]
          })
        })

        query({
          sql: `update questions set
          text = ?,
          points = ?
          where quesitons.id = ?`,
          values: [question.id],
        })
          .then((results) => {
            if (results.affectedRows !== 1)
              return resolve(null)

            // I've put this here because typescript is anxious about id being null although
            // the check at the top of the function checks for that specifically
            if (question.id === null)
              throw new Error(`Question doesn't have an id`)

            getQuestionById(question.id)
              .then((question) => {
                if (question === null)
                  return resolve(null)
                return resolve(question)
              })
          })
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

function updateQuestionByIdOld(questionId: string, text: string, points: number): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    query({
      sql: `update questions set
      text = ?,
      points = ?
      where questions.id = ?`,
      values: [text, points, questionId],
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

export default {
  getAllQuestions,
  getQuestionById,
  saveQuestion,
  updateQuestionById,
  removeQuestionById,
}
