import process from 'process';
import http from 'http';

import { pool } from './db/index';
import app from './app';

import cfgInit from './config/default';
const config = cfgInit()

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

// graceful shutdown
function gracefulShutdown() {
  console.log('Stopping express app.')
  server.close(() => {
    console.log('Stopping DB');
    pool.end(() => process.exit(0))
  });
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown)

process.on('exit', () => {
  console.log('Stopping process.');
});
