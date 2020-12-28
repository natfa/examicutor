import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import process from 'process';
import http, { Server } from 'http';

import { setupConfiguration } from './config';
import { setupModels } from './models';
import { setupApp } from './app';
import { Sequelize } from 'sequelize/types';

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
    // populate DB with test data
  }

  server.listen(config.express.port, () => console.log(`Server listening on port ${config.express.port}`))

  process.on('SIGINT', () => gracefulShutdown(server, db.sequelize));
  process.on('SIGTERM', () => gracefulShutdown(server, db.sequelize));
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


/*
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
    return Theme.findAll({ where: { name: 'Syntax and semantics' }});
  })
  .then((themes) => {
    const theme = themes[0];
    return Exam.create({
      name: 'Test exam',
      startDate: new Date(),
      timeToSolve: 360000,
      parameters: [
        { themeId: theme.id, count: 10 },
        { themeId: theme.id, count: 20 },
        { themeId: theme.id, count: 30 },
      ],
    }, {
      include: [
        { association: Exam.associations.parameters }
      ]
    });
  })
  .then((exam) => {
    console.log(exam);
    return ExamParameter.findAll();
  })
  .then((examParams) => {
    console.log(examParams);
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
  */