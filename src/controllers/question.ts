import express, { Request, Response, NextFunction} from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

import { validateQuestionBody, validateFilters } from '../validators/question'
import questiondb from '../db/questions'
import subjectdb from '../db/subjects'
import themedb from '../db/themes'

import Question from '../models/Question'
import Answer from '../models/Answer'
import Theme from '../models/Theme'
import Subject from '../models/Subject'

const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questions = await questiondb.getMany(100)
    return res.status(200).send(questions)
  }
  catch(err) {
    next(err)
  }
}

const getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const question = await questiondb.getOneById(req.params.id)

    if (question === null)
      return res.status(404).send('Not Found')
    return res.status(200).send(question)
  }
  catch(err) {
    next(err)
  }
}

const getQuestionsByFilter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectid, text } = req.params

    const questions = await questiondb.getManyBySubjectid(subjectid)
    return res.status(200).send(questions)
  }
  catch(err) {
    next(err)
  }
}

const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, subject, theme, points, correctAnswers, incorrectAnswers } = req.body
    const uploadsDir = path.resolve('./uploads')

    let answers = [
      ...correctAnswers.map((a: string) => new Answer(null, a, true)),
      ...incorrectAnswers.map((a: string) => new Answer(null, a, false)),
    ]

    // Apparently typescript's type definitions for multer are
    // fucked up, so you gotta use the any escape :D
    const files: any = req.files
    const fileBuffers: Array<Buffer> = files.map((file: any) => {
      return fs.readFileSync(path.resolve(file.path))
    })

    let subjectFound: Subject|null
    let themeFound: Theme|null

    [subjectFound, themeFound] = await Promise.all([
      subjectdb.getOneByName(subject),
      themedb.getOneByName(theme),
    ])

    if (subjectFound === null || subjectFound.id === null || subjectFound.id === undefined)
      return res.status(400).send(`Subject doesn't exist`)

    if (themeFound === null)
      themeFound = await themedb.saveOne(new Theme(null, theme, subjectFound.id))


    let question = new Question(
      null,
      text,
      answers,
      Number(points),
      subjectFound,
      themeFound,
      fileBuffers,
    )

    question = await questiondb.saveOne(question)
    return res.status(200).send(question)
  }
  catch(err) {
    next(err)
  }
}

const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id

    const success = await questiondb.deleteOneById(id)
    if (!success)
      return res.status(404).send('Not Found')
    return res.status(204).send('No Content')
  }
  catch(err) {
    next(err)
  }
}

const router = express.Router()
const upload = multer({ dest: 'uploads/'})

router.get('/', getQuestions)
router.get('/:id', getQuestionById)
router.get('/filter/:subjectid/:text?', validateFilters, getQuestionsByFilter)
router.post('/', upload.array('media', 10), validateQuestionBody, createQuestion)
router.delete('/:id', deleteQuestion)

export default router
