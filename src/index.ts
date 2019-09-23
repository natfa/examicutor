import express, { Request, Response, NextFunction } from 'express'
import session from 'express-session'
import cors from 'cors'
import FileStore from 'session-file-store'

import questionController from './controllers/question'
import subjectController from './controllers/subject'
import themeController from './controllers/theme'
import authController from './controllers/auth'

// load config
import config from './config/default'

// global config
const app = express()
const secret = config.sessionSecret
const SessionStore = FileStore(session)

// session config
const sessionConfig = {
  cookie: {
    maxAge: 3600000,
    httpOnly: true,
    // TODO: turn to true when HTTPS is enabled
    secure: false,
  },
  secret: secret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  unset: 'destroy',
  store: new SessionStore({
    retries: 1,
    reapInterval: 43200,
  })
}

const corsConfig = {
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'UPDATE'],
  credentials: true,
}

// express config
app.use(cors(corsConfig))
app.use(express.json())
app.use(session(sessionConfig))
app.use(reqLogger)

// Apply controllers
app.use('/api/question/', questionController)
app.use('/api/subject/', subjectController)
app.use('/api/theme/', themeController)
app.use('/api/auth/', authController)

function reqLogger(req: Request, res: Response, next: NextFunction) {
  const log = `[${req.method}] ${req.originalUrl}`
  console.log(log)
  next()
}

// Start express server
app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`)
})
