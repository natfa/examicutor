import express, { Request, Response, NextFunction} from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

import { validateQuestionBody, validateFilters } from '../validators/question'
import questiondb from '../db/questions'
import themedb from '../db/themes'

import Question from '../models/Question'
import { IQuestionFilters } from '../models/IQuestionFilters'
import Answer from '../models/Answer'

const router = express.Router()
const upload = multer({ dest: 'uploads/'})

// GET /question/
// Get all questions
router.get('/', (req, res, next) => {
  questiondb.getAll()
    .then((questions) => {
      return res.status(200).send(questions);
    })
    .catch((err) => {
      return next(err)
    })
});

// GET /question/subject/text
// Get's questions while applying fiters
router.get('/filter/:subject/:text?', validateFilters, (req, res, next) => {
  const { subject, text } = req.params

  const filters: IQuestionFilters = { subject, text }
  questiondb.getAll(filters)
    .then((questions) => {
      return res.status(200).send(questions)
    })
    .catch((err) => {
      return res.status(500).send(err)
    })
})

// GET /question/questionID
// Get a question by it's ID
router.get('/:questionID', (req, res, next) => {
  questiondb.getById(req.params.questionID)
    .then((question) => {
      if (!question)
        return res.status(404).send('Not Found');
      return res.status(200).send(question);
    })
    .catch((err) => {
      return next(err)
    });
})

// POST /quesiton/
// Create a new question
router.post('/', upload.array('media', 10), validateQuestionBody, (req, res, next) => {
  const { text, subject, theme, points, correctAnswers, incorrectAnswers } = req.body
  const uploadsDir = path.resolve('./uploads')

  let answers: Array<Answer> = []
  correctAnswers.map((a: string) => answers = [...answers, new Answer(null, a, true)])
  incorrectAnswers.map((a: string) => answers = [...answers, new Answer(null, a, false)])

  // Apparently typescript's type definitions for multer are
  // fucked up, so you gotta use the any escape :D
  const files: any = req.files
  const fileBuffers: Array<Buffer> = files.map((file: any) => {
    return fs.readFileSync(path.resolve(file.path))
  })

  const newQuestion = new Question(
    null,
    text,
    answers,
    Number(points),
    subject,
    theme || null,
    fileBuffers,
  )

  themedb.exists(theme)
    .then((exists) => {
      if (!exists) {
        themedb.save(subject, theme)
          .then((success) => {
            if(!success)
              return res.status(500).send('Internal server error')
          })
      }
      questiondb.save(newQuestion)
        .then((question) => {
          if (!question) {
            return res.status(500).send('Internal Server Error')
          }
          return res.status(200).send(question)
        })
        .catch((err) => {
          return next(err)
        })
    })
})

router.delete('/:questionID', (req, res) => {
  questiondb.deleteById(req.params.questionID)
    .then((success) => {
      if (!success)
        return res.status(404).send('Not Found')
      return res.status(204).send('No Content')
    })
    .catch((err) => {
      return res.status(500).send(err)
    })
})

export default router
