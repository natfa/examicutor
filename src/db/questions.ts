import pool from './index'

import Question from '../models/Question'

const getAllQuestions = (): Promise<Array<Question>> => {
  return new Promise<Array<Question>>((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err)
        throw err;

      connection.query({
        sql: `select q.*, a.*, s.*
        from questions q
        inner join answers a
        on a.questionid = q.id
        inner join subjects s
        on q.subjectid = s.id`,
        nestTables: true,
      }, (err, results, fields) => {
        if (err)
          throw err;

        let questions: Array<Question> = []

        results.map((result: any) => {
          let question: Question|undefined = questions.find((q) => q.id === String(result.a.questionid))

          if (question === undefined) {
            question = new Question(
              String(result.q.id),
              result.q.text,
              [],
              [],
              result.q.points,
              result.s.name,
              [],
            );

            questions = [...questions, question]
          }

          if (result.a.correct)
            question.correctAnswers = [...question.correctAnswers, result.a.text]
          else
            question.incorrectAnswers = [...question.incorrectAnswers, result.a.text]
        })

        connection.query({
          sql: `select q.*, m.*
          from questions q
          inner join media m
          on m.questionid = q.id`,
          nestTables: true,
        }, (err, results, fields) => {
          connection.release()
          if (err)
            throw err

          results.map((result: any) => {
            const mediaResult = result.m
            const question = questions.find((q) => q.id === String(mediaResult.questionid))
            if (!question)
              return

            question.media = [...question.media, mediaResult.content]
          })
        return resolve(questions)
        })
      })
    })
  })
}

const getQuestionById = (questionId: string): Promise<Question|null> => {
  return new Promise<Question|null>((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err)
        throw err

      connection.query({
        sql: `select q.*, a.*, s.*
        from questions q
        inner join answers a
        on a.questionid = q.id
        inner join subjects s
        on q.subjectid = s.id
        where q.id = ?`,
        values: [questionId],
        nestTables: true,
      }, (err, results, fields) => {
        if (err)
          throw err

        if (results.length === 0) {
          return resolve(null)
        }
        const questionResult = results[0].q
        const subjectName = results[0].s

        // Find correct results and save them as correct answers
        const correctAnswers = results.filter((result: any) => result.a.correct)
          .map((correctResult: any) => correctResult.a.text)

        // Find incorrect results and save them as incorrect answers
        const incorrectAnswers = results.filter((result: any) => !result.a.correct)
          .map((incorrectResult: any) => incorrectResult.a.text)

        connection.query({
          sql: `select *
          from media
          where media.questionid = ?`,
          values: [questionId]
        }, (err, results, fields) => {
          connection.release()
          if (err)
            throw err

          const media = results.map((result: any) => {
            return Buffer.from(result.content)
          })

          return resolve(new Question(
            String(questionResult.id),
            questionResult.text,
            incorrectAnswers,
            correctAnswers,
            questionResult.points,
            subjectName,
            media,
          ))
        })
      })
    })
  })
}

const getQuestionsBySubjects = (...subjects: Array<string>): Promise<Array<Question>> => {
  return new Promise<Array<Question>>((resolve, reject) => {

    // Build the query, have as many ors as needed for the names to match
    // As we read online, single query is better than many queries
    let query = `select q.*, a.*, s.*
      from questions q
    inner join answers a
    on a.questionid = q.id
    inner join subjects s
    on q.subjectid = s.id
    where s.name = ?`
    for (let i = 0, len = subjects.length - 1; i < len; i++)
      query += ' or s.name = ?'

    pool.getConnection((err, connection) => {
      if (err)
        throw err

      connection.query({
        sql: query,
        values: [...subjects],
        nestTables: true,
      }, (err, results, fields) => {
        if (err)
          throw err

        let questions: Array<Question> = []

        results.map((result: any) => {
          let question: Question|undefined = questions.find((q) => q.id === String(result.q.id))

          if (!question) {
            question = new Question(
              String(result.q.id),
              result.q.text,
              [],
              [],
              result.q.points,
              result.s.name,
              [],
            )

            questions = [...questions, question]
          }

          if (result.a.correct)
            question.correctAnswers = [...question.correctAnswers, result.a.text]
          else
            question.incorrectAnswers = [...question.incorrectAnswers, result.a.text]
        })

        let newQuery = `select m.*
          from questions q
        inner join media m
        on m.questionid = q.id
        inner join subjects s
        on q.subjectid = s.id
        where s.name = ?`
        for (let i = 0, len = subjects.length - 1; i < len; i++)
          newQuery += ' or s.name = ?'

        connection.query({
          sql: newQuery,
          values: [...subjects],
          nestTables: true,
        }, (err, results, fields) => {
          connection.release()
          if (err)
            throw err

          results.map((result: any) => {
            const question = questions.find((q) => q.id === String(result.questionid))
            if (!question)
              return

            question.media = [...question.media, Buffer.from(result.content)]
          })

          return resolve(questions)
        })
      })
    })
  })
}

const saveQuestion = (question: Question): Promise<Question> => {
  return new Promise<Question>((resolve, reject) => {
    let answers: Array<any> = []

    question.incorrectAnswers.map((answer) => {
      answers = [...answers, {
        text: answer,
        correct: false,
      }]
    })

    question.correctAnswers.map((answer) => {
      answers = [...answers, {
        text: answer,
        correct: true,
      }]
    })

    pool.getConnection((err, connection) => {
      if (err)
        throw err;

      connection.query({
        sql: `select * from subjects where name = ?`,
        values: [question.subject],
      }, (err, subjectresults, fields) => {
        if (err) {
          connection.release()
          throw err
        }

        const subject = {
          id: subjectresults[0].id,
          name: subjectresults[0].name,
        }

        if (subject.name !== question.subject)
          return reject(new Error(`Subject ${question.subject} not found, ${subjectresults} found instead`))

        connection.query({
          sql: `insert into
          questions(text, points, subjectid)
          values(?, ?, ?);`,
          values: [question.text, question.points, subject.id],
        }, (err, insertQuestionResults, fields) => {
          if (err) {
            connection.release()
            throw err
          }

          question.id = insertQuestionResults.insertId;

          answers.map((answer) => {
            connection.query({
              sql: `insert into
              answers(text, correct, questionid)
              values(?, ?, ?)`,
              values: [answer.text, answer.correct, question.id],
            }, (err, results, fields) => {
              if (err)
                throw err
            })
          })

          question.media.map((blob) => {
            connection.query({
              sql: `insert into
              media(questionid, content)
              values(?, ?)`,
              values: [question.id, blob]
            }, (err, results, fields) => {
              if (err)
                throw err
            })
          })

          connection.release()
          return resolve(question)
        })
      })
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
    pool.getConnection((err, connection) => {
      if (err)
        throw err

      connection.query({
        sql: `delete from questions where id = ?`,
        values: [questionId],
      }, (err, results, fields) => {
        if (err)
          throw err

        connection.release()

        if (results.affectedRows === 0)
          return resolve(null)
        else if (results.affectedRows === 1)
          return resolve(null)
        else
          return reject({ err, results, fields })

      })
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
