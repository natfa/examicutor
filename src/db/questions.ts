import { query } from './index';
import { OkPacket } from './OkPacket';

import { SubjectsRowDataPacket, buildSubject } from './subjects';
import { ThemesRowDataPacket, buildTheme } from './themes';

import { QuestionOld } from '../models/Question';
import { SubjectOld } from '../models/Module';
import { ThemeOld } from '../models/Theme';
import { AnswerOld } from '../models/Answer';

interface QuestionsRowDataPacket {
  id: number;
  text: string;
  points: number;
  subjectid: number;
  themeid: number;
}

interface AnswersRowDataPacket {
  id: number;
  text: string;
  correct: number; // convertable to Boolean
  questionid: number;
}

export interface FullQuestionsRowDataPacket {
  questions: QuestionsRowDataPacket;
  subjects: SubjectsRowDataPacket;
  themes: ThemesRowDataPacket;
  answers: AnswersRowDataPacket;
}

function buildAnswer(dataPacket: AnswersRowDataPacket): AnswerOld {
  const answer: AnswerOld = {
    id: String(dataPacket.id),
    text: dataPacket.text,
    correct: Boolean(dataPacket.correct),
  };

  return answer;
}


// builds a question model, but leaves out the answers property
// so that the results array can be iterated and correctly add the answers that way
function buildQuestion(dataPacket: FullQuestionsRowDataPacket): QuestionOld {
  const subject: SubjectOld = buildSubject(dataPacket.subjects);
  const theme: ThemeOld = buildTheme({
    themes: dataPacket.themes,
    subjects: dataPacket.subjects,
  });

  const question: QuestionOld = {
    id: String(dataPacket.questions.id),
    text: dataPacket.questions.text,
    points: dataPacket.questions.points,
    subject,
    theme,
    answers: [], // leave out answers
  };

  return question;
}

function addAnswerToQuestion(
  dataPacket: AnswersRowDataPacket,
  question: QuestionOld,
): QuestionOld {
  const temp = question;
  const answer: AnswerOld = buildAnswer(dataPacket);

  if (temp.answers === undefined) temp.answers = [];
  temp.answers = [...temp.answers, answer];

  return temp;
}

export function buildQuestions(dataPackets: FullQuestionsRowDataPacket[]): QuestionOld[] {
  let questions: QuestionOld[] = [];

  // single out questions
  dataPackets.forEach((packet) => {
    if (questions.find((q) => q.id === String(packet.questions.id))) return;

    questions = [...questions, buildQuestion(packet)];
  });

  questions = questions.map((question) => {
    const thisDataPackets = dataPackets
      .filter((packet) => String(packet.questions.id) === question.id);

    let q: QuestionOld = question;

    thisDataPackets.forEach((packet) => {
      q = addAnswerToQuestion(packet.answers, q);
    });

    return q;
  });

  return questions;
}

function getMany(n?: number): Promise<Array<QuestionOld>> {
  let questions: QuestionOld[];

  return new Promise<Array<QuestionOld>>((resolve, reject) => {
    query({
      sql: `select * from questions
      inner join subjects
        on questions.subjectid = subjects.id
      inner join themes
        on questions.themeid = themes.id
      inner join answers
        on questions.id = answers.questionid
      limit ?`,
      values: [n || 200],
      nestTables: true,
    }).then((results: FullQuestionsRowDataPacket[]) => {
      questions = buildQuestions(results);
      resolve(questions);
    }).catch((err) => {
      reject(err);
    });
  });
}

function getOneById(id: string): Promise<QuestionOld|null> {
  return new Promise<QuestionOld|null>((resolve, reject) => {
    query({
      sql: `select * from questions
      inner join subjects
        on questions.subjectid = subjects.id
      inner join themes
        on questions.themeid = themes.id
      inner join answers
        on questions.id = answers.questionid
      where questions.id = ?`,
      values: [id],
      nestTables: true,
    }).then((results: FullQuestionsRowDataPacket[]) => {
      const questions = buildQuestions(results);
      if (questions.length < 1) {
        resolve(null);
        return;
      }

      resolve(questions[0]);
    }).catch((err) => {
      reject(err);
    });
  });
}

function saveOne(question: QuestionOld): Promise<string> {
  let questionId: number;
  const answerCount = question.answers.length;

  return new Promise<string>((resolve, reject) => {
    query({
      sql: `insert into questions
      (text, points, subjectid, themeid) values
      (?, ?, ?, ?)`,
      values: [question.text, question.points, question.subject.id, question.theme.id],
    }).then((result: OkPacket) => {
      questionId = result.insertId;

      let sqlValues: (string|boolean|number)[] = [];
      let sqlQuery = `insert into answers
      (text, correct, questionid) values `;

      sqlQuery += question.answers.map((answer: AnswerOld) => {
        sqlValues = [...sqlValues, answer.text, answer.correct, questionId];

        return '(?, ?, ?)';
      }).join(', ');
      sqlQuery += ';';

      return query({
        sql: sqlQuery,
        values: sqlValues,
      });
    }).then((result: OkPacket) => {
      if (result.affectedRows !== answerCount) {
        reject(new Error('Something went wrong'));
        return;
      }

      resolve(String(questionId));
    }).catch((err) => {
      reject(err);
    });
  });
}

function updateOne(question: QuestionOld): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    // delete answers
    query({ sql: 'delete from answers where answers.questionid = ?', values: [question.id] });
    // delete media
    query({ sql: 'delete from media where media.questionid = ?', values: [question.id] });

    query({
      sql: `update questions set
        text = ?,
        points = ?,
        subjectid = ?,
        themeid = ?
      where questions.id = ?`,
      values: [question.text, question.points, question.subject.id, question.theme.id, question.id],
    })
      .then((result: OkPacket) => {
        if (result.affectedRows === 0) {
          return resolve(false);
        }

        let sqlValues: (string|boolean|number)[] = [];
        let sqlQuery = `insert into answers
        (text, correct, questionid) values `;

        sqlQuery += question.answers.map((answer: AnswerOld) => {
          if (question.id === undefined) {
            throw new Error('Question id can\'t be undefined when updating');
          }

          sqlValues = [...sqlValues, answer.text, answer.correct, question.id];

          return '(?, ?, ?)';
        }).join(', ');
        sqlQuery += ';';

        return query({
          sql: sqlQuery,
          values: sqlValues,
        });
      })
      .then((result: OkPacket) => {
        if (result === undefined) return;
        if (result.affectedRows !== question.answers.length) {
          reject(new Error('Something went wrong'));
          return;
        }

        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function deleteOneById(id: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    query({
      sql: 'delete from questions where id = ?',
      values: [id],
    })
      .then((result: OkPacket) => resolve(result.affectedRows === 1))
      .catch((err) => reject(err));
  });
}

function getManyBySubjectid(subjectId: string): Promise<Array<QuestionOld>> {
  return new Promise<Array<QuestionOld>>((resolve, reject) => {
    query({
      sql: `select * from questions
      inner join subjects
        on questions.subjectid = subjects.id
      inner join themes
        on questions.themeid = themes.id
      inner join answers
        on questions.id = answers.questionid
      where questions.subjectid = ?`,
      values: [subjectId],
      nestTables: true,
    }).then((results: FullQuestionsRowDataPacket[]) => {
      const questions: QuestionOld[] = buildQuestions(results);

      resolve(questions);
    }).catch((err) => {
      reject(err);
    });
  });
}

function getManyByThemeId(themeId: string): Promise<Array<QuestionOld>> {
  return new Promise<Array<QuestionOld>>((resolve, reject) => {
    query({
      sql: `select * from questions
      inner join subjects
        on questions.subjectid = subjects.id
      inner join themes
        on questions.themeid = themes.id
      inner join answers
        on questions.id = answers.questionid
      where questions.themeid = ?`,
      values: [themeId],
      nestTables: true,
    }).then((results: FullQuestionsRowDataPacket[]) => {
      const questions: QuestionOld[] = buildQuestions(results);

      resolve(questions);
    }).catch((err) => {
      reject(err);
    });
  });
}

export default {
  getOneById,
  getMany,
  saveOne,
  deleteOneById,
  updateOne,
  getManyBySubjectid,
  getManyByThemeId,
};
