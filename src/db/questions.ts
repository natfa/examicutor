import { query } from './index';
import { OkPacket } from './OkPacket';

import answerdb from './answers';
import mediadb from './media';
import { SubjectsRowDataPacket, buildSubject } from './subjects';
import { ThemesRowDataPacket, buildTheme } from './themes';

import { Question } from '../models/Question';
import { QuestionBase } from '../models/QuestionBase';
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
export function buildQuestion(dataPacket: FullQuestionsRowDataPacket): QuestionBase {
  const subject: Subject = buildSubject(dataPacket.subjects);
  const theme: Theme = buildTheme({
    themes: dataPacket.themes,
    subjects: dataPacket.subjects,
  });

  const question: QuestionBase = {
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
  question: QuestionBase,
): QuestionBase {
  const temp = question;
  const answer: Answer = buildAnswer(dataPacket);

  if (temp.answers === undefined) temp.answers = [];
  temp.answers = [...temp.answers, answer];

  return temp;
}


function getOneById(id: string): Promise<QuestionBase|null> {
  let question: QuestionBase;

  return new Promise<QuestionBase|null>((resolve, reject) => {
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

function saveOne(question: Question): Promise<Question> {
  return new Promise<Question>((resolve, reject) => {
    query({
      sql: `insert into questions
      (text, points, subjectid, themeid) values
      (?, ?, ?, ?)`,
      values: [question.text, question.points, question.subject.id, question.theme.id],
    }).then((result: OkPacket) => {
      const questionId = String(result.insertId);

      Promise.all([
        Promise.all(question.answers.map((a) => answerdb.saveOne(a, questionId))),
        Promise.all(question.media.map((m) => mediadb.saveOne(m, questionId))),
      ]).then(([answers]) => {
        const newQuestion: Question = {
          id: String(result.insertId),
          text: question.text,
          answers,
          points: question.points,
          subject: question.subject,
          theme: question.theme,
          media: question.media,
        };

        resolve(newQuestion);
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

function getMany(n?: number): Promise<Array<QuestionBase>> {
  return new Promise<Array<QuestionBase>>((resolve, reject) => {
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
      const questions: QuestionBase[] = results.map((result) => buildQuestion(result));
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

function getManyBySubjectid(subjectId: string): Promise<Array<QuestionBase>> {
  return new Promise<Array<QuestionBase>>((resolve, reject) => {
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
      const questions: QuestionBase[] = results.map((result) => buildQuestion(result));
      resolve(questions);
    }).catch((err) => {
      reject(err);
    });
  });
}

function getManyByThemeId(themeId: string): Promise<Array<QuestionBase>> {
  return new Promise<Array<QuestionBase>>((resolve, reject) => {
    query({
      sql: `select from questions
      inner join subjects
        on questions.subjectid = subjects.id
      inner join themes
        on questions.themeid = themes.id
      where questions.themeid = ?`,
      values: [themeId],
      nestTables: true,
    }).then((results: FullQuestionsRowDataPacket[]) => {
      const questions: QuestionBase[] = results.map((result) => buildQuestion(result));
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
