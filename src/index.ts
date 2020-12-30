import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import process from 'process';
import http, { Server } from 'http';

import { setupConfiguration } from './config';
import { setupModels } from './models';
import { setupApp } from './app';
import { Sequelize } from 'sequelize/types';
import { populateDatabase } from './data';

dayjs.extend(dayjsDuration);

(async function IIFE() {
  // runtime setup
  const config = setupConfiguration();
  const db = setupModels(config);
  const app = setupApp(config);
  const server = http.createServer(app);

  // db setup
  if (config.environment === 'development') {
    await db.sequelize.sync({ force: true });
    await populateDatabase(db);
  }

  server.listen(config.express.port, () => console.log(`Server listening on port ${config.express.port}`))

  process.on('SIGINT', () => {
    console.log('SIGINT received...');
    gracefulShutdown(server, db.sequelize);
  });
  process.on('SIGTERM', () => {
    console.log('SIGTERM received...');
    gracefulShutdown(server, db.sequelize);
  });
}());

function gracefulShutdown(server: Server, db: Sequelize) {
  process.stdout.write('Stopping express server...\n');
  server.close((err) => {
    if (err) {
      throw err;
    }

    process.stdout.write('Closing DB connection...\n');
    db.close()
      .then(() => {
        process.stdout.write('Done.\n');
        process.exit(0);
      });
  });
}