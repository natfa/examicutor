import mysql from 'mysql'

import config from '../config/default';

const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
})

export const query = (opts: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err)
        throw err

      connection.query(opts, (err, results, fields) => {
        connection.release()
        if (err)
          return reject(err)
        return resolve(results)
      })
    })
  })
}
