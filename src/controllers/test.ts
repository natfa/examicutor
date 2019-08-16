import express from 'express';

import Test from '../models/Test';
import Question from '../models/Question';

import questiondb from '../db/questions';

const router = express();

router.get('/', (req, res) => {
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
