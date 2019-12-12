import { PoolConnection } from 'mysql';

import { pool } from './index';

interface StudentsRowDataPacket {
  id: number;
  account_id: number;
  specialty_id: number;
}

function getStudentId(accountId: string): Promise<string|null> {
  return new Promise<string|null>((resolve, reject) => {
    pool.getConnection((connectionError: Error|null, connection: PoolConnection) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      connection.query({
        sql: `select * from students
          where students.account_id = ?`,
        values: [accountId],
      }, (queryError: Error|null, results: StudentsRowDataPacket[]) => {
        if (queryError) {
          reject(queryError);
          return;
        }

        connection.release();

        if (results.length < 1) {
          resolve(null);
          return;
        }

        resolve(String(results[0].id));
      });
    });
  });
}

export default {
  getStudentId,
};
