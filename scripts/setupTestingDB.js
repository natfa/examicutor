/**
 * Runs a sequence of commands that sets up the database in a way for the application to be
 * testable by the integration tests
 */

const bcrypt = require('bcryptjs');
const path = require('path');
const mysql = require('mysql');
const fs = require('fs').promises;
const promisify = require('util').promisify;

const cfgInit = require('../src/config/default.js');
const config = cfgInit();


const scriptPath = path.resolve(__dirname, '../sql-scripts/create-tables.sql');
const connection = mysql.createConnection({
  host:               config.db.host,
  user:               config.db.user,
  password:           config.db.password,
  database:           config.db.database,
  multipleStatements: true,
});


const query = promisify(connection.query).bind(connection);
connection.connect();


fs.readFile(scriptPath, 'utf8')
  .then((createTablesScript) => {
    console.log('Sending queries...');
    return query(createTablesScript);
  })
  .then(() => {
    console.log('Inserting test account...');
    return insertDummyAccount(query);
  })
  .then(() => {
    console.log('Inserting \'Computer Science\' specialty');
    return insertDummySpecialty(query);
  })
  .then(() => {
    connection.end();
    console.log('Done');
  })
  .catch((err) => {
    connection.end();
    console.error(err);
  });

async function insertDummyAccount(query) {
  const saltRounds = 10;
  const email = 'test@mail.com';
  const hash = await bcrypt.hash('123456', saltRounds);

  await query(
    `insert into accounts
    (email, passwordhash, roles) values
    (?, ?, 'teacher')`,
    [email, hash],
  );
}

async function insertDummySpecialty(query) {
  const specialty = {
    name: 'Computer Science',
  };

  await query('insert into specialties (name) value (?)', [specialty.name]);
}
