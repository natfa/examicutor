import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

import { validatePOST, validatePUT } from '../validators/question'
import questiondb from '../db/questions'
import Question from '../models/Question'

const router = express()
const upload = multer({ dest: 'uploads/'})

// GET /question/
// Get all questions
router.get('/', (req, res) => {
  questiondb.getAllQuestions()
    .then((questions) => {
      return res.status(200).send(questions);
    })
    .catch((err) => {
      return res.status(500).send(err);
    })
});

// GET /question/questionID
// Get a question by it's ID
router.get('/:questionID', (req, res) => {
  questiondb.getQuestionById(req.params.questionID)
    .then((question) => {
      if (!question)
        return res.status(404).send('Not Found');

      return res.status(200).send(question);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
})

// POST /quesiton/
// Create a new question
router.post('/', upload.array('media', 10), validatePOST, (req, res) => {
  const { text, subject, points, correct, incorrect } = req.body
  const correctAnswers = correct
  const incorrectAnswers = incorrect
  const uploadsDir = path.resolve('./uploads')

  // FUCK YOU TYPESCRIPT AND FUCK YOU MULTER!!!!!
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
      return res.status(500).send(err)
    })
})

// TODO: finish
router.put('/:questionID', validatePUT, (req, res) => {
  return res.status(500).send('This functionality is not working at the moment');

  questiondb.getQuestionById(req.params.questionID)
    .then((question) => {
      if (!question)
        return res.status(404).send('Not Found');

      const { text, incorrectAnswers, correctAnswers, points, subject } = req.body;

      const newQuestion = new Question(question.id, question.text, question.incorrectAnswers, question.correctAnswers, question.points, question.subject, [Buffer.from([1, 2, 3])]);

      if (text) newQuestion.text = text;
      if (incorrectAnswers) newQuestion.incorrectAnswers = incorrectAnswers;
      if (correctAnswers) newQuestion.correctAnswers = correctAnswers;
      if (points) newQuestion.points = points;

      questiondb.updateQuestionById(req.params.questionID, newQuestion)
        .then((preUpdatedQuestion) => {
          if (!preUpdatedQuestion)
            return res.status(404).send('Not Found');

          return res.status(200).send(preUpdatedQuestion);
        })
        .catch((err) => {
          return res.status(500).send(err);
        });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

router.delete('/:questionID', (req, res) => {
  questiondb.removeQuestionById(req.params.questionID)
    .then((question) => {
      if (!question)
        return res.status(404).send('Not Found');

      return res.status(200).send(question);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

export default router;
