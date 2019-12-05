import mysql from 'mysql';

import config from '../config/default';

export const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
});

export function query(opts: any): Promise<any> {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionErr, connection) => {
      if (connectionErr) {
        throw connectionErr;
      }

      connection.query(opts, (queryErr, results) => {
        connection.release();
        if (queryErr) {
          reject(queryErr);
        } else {
          resolve(results);
        }
      });
    });
  });
}

export default query;
