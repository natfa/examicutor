import express from 'express'
import mediadb from '../db/media'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = express.Router()
const upload = multer({ dest: 'uploads/'})

router.post('/:questionId', upload.single('media'), (req, res) => {
  const uploadsDir = path.resolve('./uploads')

  // Apparently typescript's type definitions for multer are
  // fucked up, so you gotta use the any escape :D
  const file: any = req.file
  const buffer: Buffer = fs.readFileSync(path.resolve(file.path))

  mediadb.saveNewMedia(req.params.questionId, buffer)
    .then((success) => {
      if (!success)
        return res.status(404).send('Not Found')
      return res.status(204).send('No Content')
    })
    .catch((err) => {
      return res.status(500).send(err)
    })
})

router.delete('/:mediaId', (req, res) => {
  mediadb.deleteById(req.params.mediaId)
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
