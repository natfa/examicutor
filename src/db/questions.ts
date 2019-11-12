import { query } from './index';

import answerdb from './answers';
import mediadb from './media';
import subjectdb from './subjects';
import themedb from './themes';

import Question from '../models/Question';
import QuestionBase from '../models/QuestionBase';
import Subject from '../models/Subject';
import Theme from '../models/Theme';
import Answer from '../models/Answer';

function saveOne(question: Question): Promise<Question> {
  return new Promise<Question>((resolve, reject) => {
    query({
      sql: `insert into questions
      (text, points, subjectid, themeid) values
      (?, ?, ?, ?)`,
      values: [question.text, question.points, question.subject.id, question.theme.id],
    }).then((result) => {
      const questionId = String(result.insertId);

      Promise.all([
        Promise.all(question.answers.map((a) => answerdb.saveOne(a, questionId))),
        Promise.all(question.media.map((m) => mediadb.saveOne(m, questionId))),
      ]).then(([answers]) => {
        resolve(new Question(
          String(result.insertId),
          question.text,
          answers,
          question.points,
          question.subject,
          question.theme,
          question.media,
        ));
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

function getOneById(id: string): Promise<Question|null> {
  return new Promise<Question|null>((resolve, reject) => {
    query({
      sql: `select id, text, points, subjectid, themeid
      from questions
      where questions.id = ?`,
      values: [id],
    }).then((results) => {
      if (results.length === 0) {
        resolve(null);
        return;
      }

      const [questionResult] = results;

      Promise.all([
        subjectdb.getOneById(questionResult.subjectid),
        themedb.getOneById(questionResult.themeid),
        answerdb.getManyByQuestionid(String(questionResult.id)),
        mediadb.getManyByQuestionid(questionResult.id),
      ]).then(([
        subject,
        theme,
        answers,
        media,
      ]: [
        Subject|null,
        Theme|null,
        Array<Answer>,
        Array<Buffer>,
      ]) => {
        if (subject === null || theme === null) {
          resolve(null);
          return;
        }

        const question = new Question(
          String(questionResult.id),
          questionResult.text,
          answers,
          questionResult.points,
          subject,
          theme,
          media,
        );

        resolve(question);
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

function getMany(n?: number): Promise<Array<QuestionBase>> {
  return new Promise<Array<QuestionBase>>((resolve, reject) => {
    query({
      sql: `select
      q.id as id,
      q.text as text,
      q.points as points,
      s.id as subjectid,
      s.name as subject,
      t.id as themeid,
      t.name as theme
      from questions q
      inner join subjects s
        on q.subjectid = s.id
      inner join themes t
        on q.themeid = t.id
      limit ?`,
      values: [n || 100],
    }).then((results) => {
      const questions = results.map((result: any) => new QuestionBase(
        String(result.id),
        result.text,
        result.points,
        new Subject(String(result.subjectid), result.subject),
        new Theme(String(result.themeid), result.theme, String(result.subjectid)),
      ));

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
      .then((result) => resolve(result.affectedRows === 1))
      .catch((err) => reject(err));
  });
}

function getManyBySubjectid(subjectid: string): Promise<Array<QuestionBase>> {
  return new Promise<Array<QuestionBase>>((resolve, reject) => {
    query({
      sql: `select
      q.id as id,
      q.text as text,
      q.points as points,
      s.id as subjectid,
      s.name as subject,
      t.id as themeid,
      t.name as theme
      from questions q
      inner join subjects s
        on q.subjectid = s.id
      inner join themes t
        on q.themeid = t.id
      where q.subjectid = ?`,
      values: [subjectid],
    }).then((results) => {
      const questions = results.map((result: any) => new QuestionBase(
        String(result.id),
        result.text,
        result.points,
        new Subject(String(result.subjectid), result.subject),
        new Theme(String(result.themeid), result.theme, String(result.subjectid)),
      ));

      resolve(questions);
    }).catch((err) => {
      reject(err);
    });
  });
}

function getManyByThemeId(themeId: string): Promise<Array<QuestionBase>> {
  return new Promise<Array<QuestionBase>>((resolve, reject) => {
    query({
      sql: `select
      q.id as id,
      q.text as text,
      q.points as points,
      s.id as subjectid,
      s.name as subject,
      t.id as themeid,
      t.name as theme
      from questions q
      inner join subjects s
        on q.subjectid = s.id
      inner join themes t
        on q.themeid = t.id
      where q.themeid = ?`,
      values: [themeId],
    }).then((results) => {
      const questions = results.map((result: any) => new QuestionBase(
        String(result.id),
        result.text,
        result.points,
        new Subject(String(result.subjectid), result.subject),
        new Theme(String(result.themeid), result.theme, String(result.subjectid)),
      ));

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
