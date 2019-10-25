import express, { Request, Response, NextFunction} from 'express'
import multer from 'multer';
import path from 'path'
import fs from 'fs'

import { validateQuestionBody, validateFilters } from '../validators/question'
import { isAuthenticated } from '../middleware/isAuthenticated'

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
  // get question data
  // get uploaded data (go to /uploads and grab the buffers for each file uploaded)
  //
  // figure out if you need to create a new subject and theme
  //   create them
  //
  // compile answers
  // insert question
  // return question to client

  return res.status(500).send('Not implemented');
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
const upload = multer({ dest: 'uploads/' });

router.use(isAuthenticated)

router.get('/', getQuestions)
router.get('/:id', getQuestionById)
router.get('/filter/:subjectid/:text?', validateFilters, getQuestionsByFilter)
router.post('/', upload.array('media'), createQuestion) // TODO: intoduce a questionBody validator
router.delete('/:id', deleteQuestion)

export default router
