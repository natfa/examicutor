import process from 'process';
import http from 'http';
import { pool } from './db/index';
import app from './app';

import config from './config/default';

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

// graceful shutdown
function gracefulShutdown() {
  console.log('Stopping express app.')
  server.close((err) => {
    if (err) {
      console.error(err);
    }

    console.log('Stopping DB');
    pool.end((err) => {
      if (err) {
        console.error(err);
      }
      process.exit(0)
    });
  });
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown)

process.on('exit', () => {
  console.log('Stopping process.');
});
