import { query } from './index';

interface MediaRowDataPacket {
  id: number;
  content: Buffer;
  questionid: number;
}

function saveOne(blob: Buffer, questionId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    query({
      sql: `insert into media
      (content, questionid) values
      (?, ?)`,
      values: [blob, questionId],
    }).then((/* result */) => {
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
}

function getManyByQuestionId(questionId: string): Promise<Array<Buffer>> {
  return new Promise<Array<Buffer>>((resolve, reject) => {
    query({
      sql: `select * from media
      where media.questionid = ?`,
      values: [questionId],
    }).then((results: MediaRowDataPacket[]) => {
      const media = results.map((result) => result.content);

      resolve(media);
    }).catch((err) => {
      reject(err);
    });
  });
}

export default {
  saveOne,
  getManyByQuestionId,
};
