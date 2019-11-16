import { query } from './index';

import { OkPacket } from './OkPacket';

import { Subject } from '../models/Subject';

export interface SubjectsRowDataPacket {
  id: number;
  name: string;
}

export function buildSubject(dataPacket: SubjectsRowDataPacket): Subject {
  const subject: Subject = {
    id: String(dataPacket.id),
    name: dataPacket.name,
  };

  return subject;
}

function saveOne(model: Subject): Promise<Subject> {
  return new Promise<Subject>((resolve, reject) => {
    query({
      sql: `insert into subjects
      (name) values (?)`,
      values: [model.name],
    }).then((result: OkPacket) => {
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
    }).then((results: SubjectsRowDataPacket[]) => {
      if (results.length === 0) {
        resolve(null);
        return;
      }

      const subject = buildSubject(results[0]);
      resolve(subject);
    }).catch((err) => {
      reject(err);
    });
  });
}

function getAll(): Promise<Array<Subject>> {
  return new Promise<Array<Subject>>((resolve, reject) => {
    query({
      sql: 'select * from subjects',
    }).then((results: SubjectsRowDataPacket[]) => {
      const array = results.map((result) => buildSubject(result));

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
    }).then((result: OkPacket) => {
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
    }).then((results: SubjectsRowDataPacket[]) => {
      if (results.length === 0) {
        resolve(null);
        return;
      }

      const subject = buildSubject(results[0]);
      resolve(subject);
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
