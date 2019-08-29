import express, { Request, Response, NextFunction } from 'express'
import session from 'express-session'
import cors from 'cors'

import authenticationController from './controllers/authentication'
import accountController from './controllers/account'
import questionController from './controllers/question'
import testController from './controllers/test'
import subjectController from './controllers/subject'

// load config
import config from './config/default'

// global config
const app = express()
const secret = config.sessionSecret

// Express config
app.use(cors())
app.use(express.json())
app.use(session({ secret }))
app.use(reqLogger)

// Apply controllers
app.use('/api/authentication/', authenticationController)
app.use('/api/account/', accountController)
app.use('/api/question/', questionController)
app.use('/api/test/', testController)
app.use('/api/subject/', subjectController)

function reqLogger(req: Request, res: Response, next: NextFunction) {
  const log = `[${req.method}] ${req.originalUrl}`
  console.log(log)
  next()
}

// Start express server
app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`)
})
