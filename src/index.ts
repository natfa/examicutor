import process from 'process';
import http from 'http';
import app from './app';
import config from './config/default';

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

// graceful shutdown
process.on('SIGTERM', () => {
  console.log('Stopping express app.')
  server.close(() => {
    process.exit();
  });
});

process.on('exit', () => {
  console.log('Stopping process.');
});
