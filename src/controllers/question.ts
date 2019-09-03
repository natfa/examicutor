import express, { Request, Response, NextFunction} from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

import { validatePOST, validatePUT } from '../validators/question'
import questiondb from '../db/questions'
import Question from '../models/Question'

const router = express.Router()
const upload = multer({ dest: 'uploads/'})

// GET /question/
// Get all questions
router.get('/', (req, res, next) => {
  questiondb.getAllQuestions()
    .then((questions) => {
      return res.status(200).send(questions);
    })
    .catch((err) => {
      return next(err)
    })
});

// GET /question/questionID
// Get a question by it's ID
router.get('/:questionID', (req, res, next) => {
  questiondb.getQuestionById(req.params.questionID)
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
router.post('/', upload.array('media', 10), validatePOST, (req, res, next) => {
  const { text, subject, points, correct, incorrect } = req.body
  const correctAnswers = correct
  const incorrectAnswers = incorrect
  const uploadsDir = path.resolve('./uploads')

  // Apparently typescript's type definitions for multer are
  // fucked up, so you gotta use the any escape :D
  const files: any = req.files
  const fileBuffers: Array<Buffer> = files.map((file: any) => {
    return fs.readFileSync(path.resolve(file.path))
  })

  const newQuestion = new Question(
    null,
    text,
    incorrectAnswers,
    correctAnswers,
    Number(points),
    subject,
    fileBuffers,
  )

  questiondb.saveQuestion(newQuestion)
    .then((question) => {
      return res.status(200).send(question)
    })
    .catch((err) => {
      return next(err)
    })
})

// TODO: finish
router.put('/:questionID', validatePUT, (req, res, next) => {
  return next(new Error('This functionality is not working at the moment'))
});

router.delete('/:questionID', (req, res) => {
  questiondb.removeQuestionById(req.params.questionID)
    .then((success) => {
      if (success)
        return res.status(200).end()
      return res.status(404).send('Not Found')
    })
    .catch((err) => {
      return res.status(500).send(err)
    });
});

export default router
