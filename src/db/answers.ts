import { query } from './index';

import { Answer } from '../models/Answer';

function saveOne(answer: Answer, questionid: string): Promise<Answer> {
  return new Promise<Answer>((resolve, reject) => {
    query({
      sql: `insert into answers
      (text, correct, questionid) values
      (?, ?, ?)`,
      values: [answer.text, answer.correct, questionid],
    }).then((result) => {
      const newAnswer: Answer = {
        id: String(result.insertId),
        text: answer.text,
        correct: Boolean(answer.correct),
      };

      resolve(newAnswer);
    }).catch((err) => {
      reject(err);
    });
  });
}

function getManyByQuestionid(questionid: string): Promise<Array<Answer>> {
  return new Promise<Array<Answer>>((resolve, reject) => {
    query({
      sql: `select id, text, correct
      from answers
      where answers.questionid = ?`,
      values: [questionid],
    }).then((results) => {
      const array: Answer[] = results.map((result: any) => ({
        id: String(result.id),
        text: result.text,
        correct: Boolean(result.correct),
      }));

      resolve(array);
    }).catch((err) => {
      reject(err);
    });
  });
}

export default {
  saveOne,
  getManyByQuestionid,
};
