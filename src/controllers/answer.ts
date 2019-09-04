import express from 'express'
import answerdb from '../db/answers'
import Answer from '../models/Answer'

import { validatePOST, validatePUT } from '../validators/answer'

const router = express.Router()

router.post('/:questionId', validatePOST, (req, res) => {
  const { text, correct } = req.body

  const answer = new Answer(null, text, correct)

  answerdb.saveAnswer(req.params.questionId, answer)
    .then((answer) => {
      if (!answer)
        return res.status(404).send('Not Found')
      return res.status(201).send(answer)
    })
    .catch((err) => {
      return res.status(500).send(err)
    })
})

router.put('/:answerId', validatePUT, (req, res) => {
  const { text, correct } = req.body

  answerdb.updateAnswer(req.params.answerId, text, correct)
    .then((success) => {
      if (!success)
        return res.status(404).send('Not Found')
      return res.status(204).send('No Content')
    })
    .catch((err) => {
      return res.status(500).send(err)
    })
})

router.delete('/:answerId', (req, res) => {
  answerdb.deleteAnswer(req.params.answerId)
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
