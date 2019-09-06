import express from 'express'

import { validateQuery } from '../validators/test'

import Test from '../models/Test'
import Question from '../models/Question'

import questiondb from '../db/questions'
import testdb from '../db/tests'

const router = express()

interface TestFilters {
  [filter: string]: number
}

function compileTest (questions: Array<Question>, maxQuestions: number, filters: TestFilters): Test {
  let addedQuestions: Array<Question> = []
  let leftover: Array<Question> = questions.splice(0)

  for (let subject in filters) {
    let currentCount = 0
    const count = filters[subject]
    const questionsFromSubject = leftover.filter((question) => question.subject === subject)
    leftover = leftover.filter((question) => question.subject !== subject)

    while (currentCount < count) {
      const nextQuestion = questionsFromSubject.pop()
      if (nextQuestion === undefined || nextQuestion === null)
        break

      addedQuestions = [...addedQuestions, nextQuestion]
      currentCount++
    }
    leftover = [...leftover, ...questionsFromSubject]
  }

  while (maxQuestions > addedQuestions.length) {
    const question = leftover.pop()
    if (question === undefined || question === null)
      break

    addedQuestions = [...addedQuestions, question]
  }

  return new Test(undefined, '', addedQuestions, new Date(), new Date(), new Date())
}

router.get('/', validateQuery, (req, res) => {
  const { total, subjects } = req.query

  // validate question count
  const subjectsTotal = Object.keys(subjects)
    .reduce((acc: number, key: string) => acc += Number(subjects[key]), 0)

  if (subjectsTotal > total)
    return res.status(400).send(`Subjects count more than total`)

  return res.status(500).send('Not implemented')
})

router.post('/', (req, res) => {
  const { name, questions } = req.body

  testdb.saveTest(new Test(
    undefined,
    name,
    questions,
    new Date(),
    new Date(),
    new Date(),
  ))
    .then((result) => {
      return res.status(200).send(result)
    })
    .catch((err) => {
      return res.status(500).send(err)
    })
})

export default router
