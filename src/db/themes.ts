import { query } from './index';

import Theme from '../models/Theme';

function saveOne(theme: Theme): Promise<Theme> {
  return new Promise<Theme>((resolve, reject) => {
    query({
      sql: `insert into themes
      (name, subjectid) values
      (?, ?)`,
      values: [theme.name, theme.subjectId],
    }).then((result) => {
      resolve({
        id: String(result.insertId),
        name: theme.name,
        subjectId: theme.subjectId,
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

function getOneById(id: string): Promise<Theme|null> {
  return new Promise<Theme|null>((resolve, reject) => {
    query({
      sql: `select id, name, subjectid
      from themes
      where themes.id = ?`,
      values: [id],
    }).then((results) => {
      if (results.length === 0) {
        resolve(null);
        return;
      }

      const theme: Theme = {
        id: results[0].id,
        name: results[0].name,
        subjectId: results[0].subjectid,
      };

      resolve(theme);
    }).catch((err) => {
      reject(err);
    });
  });
}

function getAll(): Promise<Array<Theme>> {
  return new Promise<Array<Theme>>((resolve, reject) => {
    query({
      sql: `select id, name, subjectid
      from themes`,
    }).then((results) => {
      const array: Theme[] = results.map((result: any) => ({
        id: String(result.id),
        name: result.name,
        subjectId: String(result.subjectid),
      }));

      resolve(array);
    }).catch((err) => {
      reject(err);
    });
  });
}

function deleteOneById(id: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    query({
      sql: `delete from themes
      where themes.id = ?`,
      values: [id],
    }).then((result) => {
      if (result.affectedRows === 1) {
        resolve(true);
      } else if (result.affectedRows === 0) {
        resolve(false);
      } else {
        throw new Error('Something is wrong with the database consistency');
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

function getManyBySubjectid(id: string): Promise<Array<Theme>> {
  return new Promise<Array<Theme>>((resolve, reject) => {
    query({
      sql: `select id, name, subjectid
      from themes
      where themes.subjectid = ?`,
      values: [id],
    }).then((results) => {
      const array: Theme[] = results.map((result: any) => ({
        id: String(result.id),
        name: result.name,
        subjectId: String(result.subjectid),
      }));

      resolve(array);
    }).catch((err) => {
      reject(err);
    });
  });
}

function getOneByName(name: string): Promise<Theme|null> {
  return new Promise<Theme|null>((resolve, reject) => {
    query({
      sql: `select id, name, subjectid
      from themes
      where themes.name = ?`,
      values: [name],
    }).then((results) => {
      if (results.length === 0) {
        resolve(null);
        return;
      }

      const theme: Theme = {
        id: String(results[0].id),
        name: results[0].name,
        subjectId: String(results[0].subjectid),
      };

      resolve(theme);
    }).catch((err) => {
      reject(err);
    });
  });
}

export default {
  saveOne,
  getOneById,
  getAll,
  deleteOneById,
  getManyBySubjectid,
  getOneByName,
};
