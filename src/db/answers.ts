import { query } from './index';

import Answer from '../models/Answer';

function saveOne(answer: Answer, questionid: string): Promise<Answer> {
  return new Promise<Answer>((resolve, reject) => {
    query({
      sql: `insert into answers
      (text, correct, questionid) values
      (?, ?, ?)`,
      values: [answer.text, answer.correct, questionid],
    }).then((result) => {
      resolve(new Answer(
        String(result.insertId),
        answer.text,
        Boolean(answer.correct),
      ));
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
      const array = results.map((result: any) => new Answer(
        String(result.id),
        result.text,
        Boolean(result.correct),
      ));

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
