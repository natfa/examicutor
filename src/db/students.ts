import { PoolConnection } from 'mysql';

import { pool } from './index';

import { SpecialtiesRowDataPacket, buildSpecialty } from './specialties';
import { AccountsRowDataPacket } from './accounts';

import { StudentOld } from '../models/Student';

export interface StudentsRowDataPacket {
  id: number;
  account_id: number;
  specialty_id: number;
}

export interface FullStudentRowDataPacket {
  specialties: SpecialtiesRowDataPacket;
  students: StudentsRowDataPacket;
  accounts: AccountsRowDataPacket;
}

export function buildStudent(packet: FullStudentRowDataPacket): StudentOld {
  const specialty = buildSpecialty(packet.specialties);

  return {
    id: String(packet.students.id),
    email: packet.accounts.email,
    specialty,
  };
}

function getStudentByAccountId(accountId: string): Promise<StudentOld|null> {
  return new Promise<StudentOld|null>((resolve, reject) => {
    pool.getConnection((connectionError: Error|null, connection: PoolConnection) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      connection.query({
        sql: `select * from students
        inner join accounts
          on accounts.id = students.account_id
        inner join specialties
          on specialties.id = students.specialty_id
        where students.account_id = ?`,
        values: [accountId],
        nestTables: true,
      }, (queryError: Error|null, results: FullStudentRowDataPacket[]) => {
        if (queryError) {
          reject(queryError);
          return;
        }

        connection.release();

        if (results.length < 1) {
          resolve(null);
          return;
        }

        const student = buildStudent(results[0]);
        resolve(student);
      });
    });
  });
}

function getStudentById(studentId: string): Promise<StudentOld|null> {
  return new Promise<StudentOld|null>((resolve, reject) => {
    pool.getConnection((connectionError: Error|null, connection: PoolConnection) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      connection.query({
        sql: `select * from students
        inner join accounts
          on accounts.id = students.account_id
        inner join specialties
          on specialties.id = students.specialty_id
        where students.id = ?`,
        values: [studentId],
        nestTables: true,
      }, (queryError: Error|null, results: FullStudentRowDataPacket[]) => {
        if (queryError) {
          reject(queryError);
          return;
        }

        connection.release();

        if (results.length < 1) {
          resolve(null);
          return;
        }

        const student = buildStudent(results[0]);
        resolve(student);
      });
    });
  });
}

export default {
  getStudentById,
  getStudentByAccountId,
};
