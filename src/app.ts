import express from 'express';
import path from 'path';
import session from 'express-session';
import FileStore from 'session-file-store';

import requestLogger from './utils/requestLogger';

import questionController from './controllers/question';
import mediaController from './controllers/media';
import subjectController from './controllers/subject';
import themeController from './controllers/theme';
import authController from './controllers/auth';
import examController from './controllers/exam';

// load config
import config from './config/default';

// global config
const app = express();
const secret = config.sessionSecret;
const SessionStore = FileStore(session);

// session config
const sessionConfig = {
  cookie: {
    maxAge: 3600000,
    httpOnly: true,
    // TODO: turn to true when HTTPS is enabled
    secure: false,
  },
  secret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  unset: 'destroy',
  store: new SessionStore({
    retries: 1,
    reapInterval: 43200,
  }),
};

// express config
app.use(express.json());
app.use(session(sessionConfig));
app.use(requestLogger);

// apply controllers
app.use('/api/question/', questionController);
app.use('/api/media/', mediaController);
app.use('/api/subject/', subjectController);
app.use('/api/theme/', themeController);
app.use('/api/auth/', authController);
app.use('/api/exam/', examController);

// serve javascript bundles
app.use('/', express.static(path.resolve(config.clientPath)));

// serve react apps with routers
app.get('/teacher/*', (_, res) => res.sendFile(path.resolve(config.clientPath, 'teacher/index.html')));
app.get('/student/*', (_, res) => res.sendFile(path.resolve(config.clientPath, 'student/index.html')));

app.get('/', (_, res) => {
  res.redirect('/landing');
});

export default app;
