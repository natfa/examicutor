import express from 'express'

import subjectdb from '../db/subjects'

const router = express()

router.get('/', (req, res) => {
  subjectdb.getAllSubjects()
    .then((subjects: Array<String>) => {
      return res.status(200).send(subjects)
    })
    .catch((err) => {
      return res.status(500).send(err)
    })
})

export default router
