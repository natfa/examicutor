import express from 'express'

import { validateQuery } from '../validators/test'

import Test from '../models/Test'
import Question from '../models/Question'

import questiondb from '../db/questions'

const router = express()

router.get('/', validateQuery, (req, res) => {
  const { total, subjects } = req.query;




  return res.status(200).end()










  questiondb.getAllQuestions()
    .then((questions) => {
      let testQuestions = questions.filter((question) => {
        return question;
      })

      const test = new Test('New test test', testQuestions);
      res.status(200).send(test.publish());
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
})

export default router;
