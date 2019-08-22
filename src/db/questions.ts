import mysql from 'mysql';

import pool from './index';

import Question from '../models/Question';

interface AnswerResult {
  id: Number;
  text: String;
  correct: Number;
  questionid: Number;
}

interface QuestionResult {
  id: Number;
  text: String;
  points: Number;
}

const getAllQuestions = (): Promise<Array<Question>> => {
  return new Promise<Array<Question>>((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err)
        throw err;

      connection.query({
        sql: `select q.*, a.*
        from questions q
        inner join answers a
        on a.questionid = q.id`,
        nestTables: true,
      }, (err, results, fields) => {
        if (err)
          throw err;

        connection.release();
        let questions: Array<Question> = [];

        results.map((result: any) => {
          let question: Question|undefined = questions.find((q) => q.id === String(result.a.questionid));

          if (question === undefined) {
            question = new Question(
              String(result.q.id),
              result.q.text,
              [],
              [],
              result.q.points,
              'Math',
            );

            questions = [...questions, question];
          }

          if (result.a.correct)
            question.correctAnswers = [...question.correctAnswers, result.a.text];
          else
            question.incorrectAnswers = [...question.incorrectAnswers, result.a.text];
        })

        return resolve(questions);
      })
    })
  });
}

const getQuestionById = (questionId: String): Promise<Question|null> => {
  return new Promise<Question|null>((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        if (connection)
          connection.release();

        throw err;
      }

      connection.query({
        sql: `select q.*, a.*
        from questions q
        inner join answers a
        on a.questionid = q.id
        where q.id = ?`,
        values: [questionId],
        nestTables: true,
      }, (err, results, fields) => {
        connection.release();

        if (results.length === 0) {
          return resolve(null);
        }

        // Find correct results and save them as correct answers
        const correctAnswers = results.filter((result: any) => result.a.correct)
          .map((correctResult: any) => {
            return correctResult.a.text;
          })

        // Find incorrect results and save them as incorrect answers
        const incorrectAnswers = results.filter((result: any) => !(result.a.correct))
          .map((incorrectResult: any) => {
            return incorrectResult.a.text;
          })

        // Get the interface value from the 'any' value
        // This is needed only to have some type checking
        const questionResult: QuestionResult = results[0].q;

        return resolve(new Question(
          String(questionResult.id),
          questionResult.text,
          incorrectAnswers,
          correctAnswers,
          questionResult.points,
          'Math'
        ));
      })
    })
  });
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
        sql: `insert into
        questions(text, points)
        values(?, ?)`,
        values: [question.text, question.points],
      }, (err, results, fields) => {
        if (err)
          throw err

        question.id = results.insertId;

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

        connection.release()
        return resolve(question);
      });
    })
  });
}

const updateQuestionById = (questionId: String, update: any): Promise<Question|null> => {
  return new Promise<Question|null>((resolve, reject) => {
  });
}

// TODO: Make the deletion cascade as well
const removeQuestionById = (questionId: String): Promise<Question|null> => {
  return new Promise<Question|null>((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err)
        throw err

      connection.query({
        sql: `delete from questions where id = ?`,
        values: [questionId],
      }, (err, results, fields) => {
        connection.release()

        console.log(results);
      })
    })
  });
}

export default {
  getAllQuestions,
  getQuestionById,
  saveQuestion,
  updateQuestionById,
  removeQuestionById,
}
