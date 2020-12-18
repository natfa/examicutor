import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import process from 'process';
import http from 'http';
import app from './app';
import bcrypt from 'bcryptjs';

import config from './config/default';

import {
  sequelize,
  User,
  Role,
  Module,
  Specialty,
} from './models';

dayjs.extend(dayjsDuration);

sequelize.sync({ force: true })
  .then(() => {
    console.log('Creating roles');

    return Role.bulkCreate([
      { name: 'admin' },
      { name: 'teacher' },
      { name: 'student' },
    ]);
  }).then(() => {
    console.log('Generating hash');
    return bcrypt.hash('@lokinSkywalker&5101', 10);
  }).then((hash) => {
    console.log('Creating user');

    return User.create({
      email: 'federlizer@gmail.com',
      passwordHash: hash,
      roleId: 2,
    });
  })
  .then((user) => {
    console.log(user.toJSON());

    return Module.bulkCreate([
      { name: 'Math', themes: [
        { name: 'Algebra' },
        { name: 'Geometry' },
      ]},
      { name: 'Programming', themes: [
        { name: 'Languages' },
        { name: 'Syntax and semantics' },
      ]},
    ], {
      include: [Module.associations.themes],
    });
  })
  .then(() => {
    return Specialty.bulkCreate([
      { name: 'Computer Science' },
      { name: 'Business' },
    ]);
  })
  .then(() => {
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
        sequelize.close().then(() => process.exit(0));
      });
    }

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown)

    process.on('exit', () => {
      console.log('Stopping process.');
    });
  })
  .catch((err) => console.error(err));