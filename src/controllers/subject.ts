import express, { Request, Response, NextFunction } from 'express'
import { validateSubjectBody } from '../validators/subject'

import subjectdb from '../db/subjects'

import Subject from '../models/Subject'

const router = express()

const createSubject = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body
    const subject = await subjectdb.saveOne(new Subject(null, name))
    return res.status(201).send(subject)
  }
  catch (err) {
    next(err)
  }
}

const getAllSubjects = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const subjects = await subjectdb.getAll()
    return res.status(200).send(subjects)
  }
  catch (err) {
    next(err)
  }
}

const deleteSubject = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const success = await subjectdb.deleteOneById(req.params.id)
    if (!success)
      return res.status(400).end()
    return res.status(204).end()
  }
  catch (err) {
    next(err)
  }
}

router.get('/', getAllSubjects)
router.post('/', validateSubjectBody, createSubject)
router.delete('/:id', deleteSubject)


export default router
