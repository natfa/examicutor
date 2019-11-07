import { query } from './index';

function saveOne(blob: Buffer, questionid: string): Promise<void> {
  return new Promise((resolve, reject) => {
    query({
      sql: `insert into media
      (content, questionid) values
      (?, ?)`,
      values: [blob, questionid],
    }).then((/* result */) => {
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
}

function getManyByQuestionid(questionid: string): Promise<Array<Buffer>> {
  return new Promise<Array<Buffer>>((resolve, reject) => {
    query({
      sql: `select content
      from media
      where media.questionid = ?`,
      values: [questionid],
    }).then((results) => {
      const array = results.map((result: any) => result.content);

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
