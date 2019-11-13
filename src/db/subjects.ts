import { query } from './index';

import { Subject } from '../models/Subject';

function saveOne(model: Subject): Promise<Subject> {
  return new Promise<Subject>((resolve, reject) => {
    query({
      sql: `insert into subjects
      (name) values (?)`,
      values: [model.name],
    }).then((result) => {
      resolve({
        id: String(result.insertId),
        name: model.name,
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

function getOneById(id: string): Promise<Subject|null> {
  return new Promise<Subject|null>((resolve, reject) => {
    query({
      sql: 'select * from subjects where subjects.id = ?',
      values: [id],
    }).then((results) => {
      if (results.length === 0) {
        resolve(null);
        return;
      }

      const subject = {
        id: results[0].id,
        name: results[0].name,
      };

      resolve({
        id: String(subject.id),
        name: subject.name,
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

function getAll(): Promise<Array<Subject>> {
  return new Promise<Array<Subject>>((resolve, reject) => {
    query({
      sql: 'select * from subjects',
    }).then((results) => {
      const array = results.map((result: any) => ({
        id: String(result.id),
        name: result.name,
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
      sql: `delete from subjects
      where subjects.id = ?`,
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

function getOneByName(name: string): Promise<Subject|null> {
  return new Promise<Subject|null>((resolve, reject) => {
    query({
      sql: `select id, name
      from subjects
      where subjects.name = ?`,
      values: [name],
    }).then((results) => {
      if (results.length === 0) {
        resolve(null);
        return;
      }

      resolve({
        id: String(results[0].id),
        name: results[0].name,
      });
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
  getOneByName,
};
