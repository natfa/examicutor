import { query } from './index';
import { OkPacket } from './OkPacket';

import { SubjectsRowDataPacket, buildSubject } from './subjects';
import { ThemesRowDataPacket, buildTheme } from './themes';

import { Question } from '../models/Question';
import { Subject } from '../models/Subject';
import { Theme } from '../models/Theme';
import { Answer } from '../models/Answer';

interface QuestionsRowDataPacket {
  id: number;
  text: string;
  points: number;
  subjectid: number;
  themeid: number;
}

export interface AnswersRowDataPacket {
  id: number;
  text: string;
  correct: number; // convertable to Boolean
  questionid: number;
}

export interface FullQuestionsRowDataPacket {
  questions: QuestionsRowDataPacket;
  subjects: SubjectsRowDataPacket;
  themes: ThemesRowDataPacket;
}

export function buildAnswer(dataPacket: AnswersRowDataPacket): Answer {
  const answer: Answer = {
    id: String(dataPacket.id),
    text: dataPacket.text,
    correct: Boolean(dataPacket.correct),
  };

  return answer;
}


// builds a question model, but leaves out the answers property
// so that the results array can be iterated and correctly add the answers that way
export function buildQuestion(dataPacket: FullQuestionsRowDataPacket): Question {
  const subject: Subject = buildSubject(dataPacket.subjects);
  const theme: Theme = buildTheme({
    themes: dataPacket.themes,
    subjects: dataPacket.subjects,
  });

  const question: Question = {
    id: String(dataPacket.questions.id),
    text: dataPacket.questions.text,
    points: dataPacket.questions.points,
    subject,
    theme,
    answers: [], // leave out answers
  };

  return question;
}

export function addAnswerToQuestion(
  dataPacket: AnswersRowDataPacket,
  question: Question,
): Question {
  const temp = question;
  const answer: Answer = buildAnswer(dataPacket);

  if (temp.answers === undefined) temp.answers = [];
  temp.answers = [...temp.answers, answer];

  return temp;
}


function getOneById(id: string): Promise<Question|null> {
  let question: Question;

  return new Promise<Question|null>((resolve, reject) => {
    query({
      sql: `select * from questions
      inner join subjects
        on questions.subjectid = subjects.id
      inner join themes
        on questions.themeid = themes.id
      where questions.id = ?`,
      values: [id],
      nestTables: true,
    }).then((results: FullQuestionsRowDataPacket[]) => {
      if (results.length === 0) return resolve(null);

      question = buildQuestion(results[0]);

      return query({
        sql: `select * from answers
        where answers.questionid = ?`,
        values: [id],
      });
    }).then((results: AnswersRowDataPacket[]) => {
      results.forEach((result) => {
        question = addAnswerToQuestion(result, question);
      });

      resolve(question);
    }).catch((err) => {
      reject(err);
    });
  });
}

function saveOne(question: Question): Promise<string> {
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

      sqlQuery += question.answers.map((answer: Answer) => {
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

function getMany(n?: number): Promise<Array<Question>> {
  return new Promise<Array<Question>>((resolve, reject) => {
    query({
      sql: `select * from questions
      inner join subjects
        on questions.subjectid = subjects.id
      inner join themes
        on questions.themeid = themes.id
      limit ?`,
      values: [n || 100],
      nestTables: true,
    }).then((results: FullQuestionsRowDataPacket[]) => {
      const questions: Question[] = results.map((result) => buildQuestion(result));
      resolve(questions);
    }).catch((err) => {
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

function getManyBySubjectid(subjectId: string): Promise<Array<Question>> {
  return new Promise<Array<Question>>((resolve, reject) => {
    query({
      sql: `select * from questions
      inner join subjects
        on questions.subjectid = subjects.id
      inner join themes
        on questions.themeid = themes.id
      where questions.subjectid = ?`,
      values: [subjectId],
      nestTables: true,
    }).then((results: FullQuestionsRowDataPacket[]) => {
      const questions: Question[] = results.map((result) => buildQuestion(result));
      resolve(questions);
    }).catch((err) => {
      reject(err);
    });
  });
}

function getManyByThemeId(themeId: string): Promise<Array<Question>> {
  return new Promise<Array<Question>>((resolve, reject) => {
    query({
      sql: `select * from questions
      inner join subjects
        on questions.subjectid = subjects.id
      inner join themes
        on questions.themeid = themes.id
      where questions.themeid = ?`,
      values: [themeId],
      nestTables: true,
    }).then((results: FullQuestionsRowDataPacket[]) => {
      const questions: Question[] = results.map((result) => buildQuestion(result));
      resolve(questions);
    }).catch((err) => {
      reject(err);
    });
  });
}

export default {
  saveOne,
  getOneById,
  getMany,
  getManyBySubjectid,
  getManyByThemeId,
  deleteOneById,
};
