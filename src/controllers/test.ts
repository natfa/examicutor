import express from 'express'

import { validateQuery } from '../validators/test'

import Test from '../models/Test'
import Question from '../models/Question'

import questiondb from '../db/questions'

const router = express()

interface PublicQuestion {
  text: String
  answers: Array<String>
}

router.get('/', validateQuery, (req, res) => {
  const { total, subjects } = req.query

  // validate question count
  const subjectsTotal = Object.keys(subjects)
    .reduce((acc: number, key: string) => acc += Number(subjects[key]), 0)

  if (subjectsTotal > total)
    return res.status(400).send(`Subjects count more than total`)

  questiondb.getQuestionsBySubjects(...Object.keys(subjects))
    .then((questions) => {
      let questioneer: Array<PublicQuestion> = []

      questions
        .map((question) => {
          const pq: PublicQuestion = {
            text: question.text,
            answers: [...question.incorrectAnswers, ...question.correctAnswers],
          }

          questioneer = [...questioneer, pq]
        })

      return res.status(200).send(questioneer)
    })
    .catch((err) => {
      return res.status(500).send(err)
    })
})

export default router
