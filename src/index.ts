import express, { Request, Response, NextFunction } from 'express'
import session from 'express-session'
import cors from 'cors'

import questionController from './controllers/question'
import subjectController from './controllers/subject'
import themeController from './controllers/theme'

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
app.use('/api/question/', questionController)
app.use('/api/subject/', subjectController)
app.use('/api/theme/', themeController)

function reqLogger(req: Request, res: Response, next: NextFunction) {
  const log = `[${req.method}] ${req.originalUrl}`
  console.log(log)
  next()
}

// Start express server
app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`)
})
