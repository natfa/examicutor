import mysql from 'mysql';

import cfgInit from '../config/default';
const config = cfgInit();

console.log(config);

export const pool = createPool(config);

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

function createPool(cfg: any) {
  const pool = mysql.createPool({
    host:               cfg.db.host,
    user:               cfg.db.user,
    password:           cfg.db.password,
    database:           cfg.db.database,
    waitForConnections: true,
  });

  return pool;
}

export default query;
