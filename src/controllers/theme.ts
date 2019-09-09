import express from 'express'

import themedb from '../db/themes'

const router = express()

router.get('/', (req, res) => {
  themedb.getAllThemes()
    .then((themes: Array<string>) => {
      return res.status(200).send(themes)
    })
    .catch((err) => {
      return res.status(500).send(err)
    })
})

router.get('/:subject', (req, res) => {
  themedb.getThemesBySubject(req.params.subject)
    .then((themes: Array<string>) => {
      return res.status(200).send(themes)
    })
    .catch((err) => {
      return res.status(500).send(err)
    })
})

export default router
