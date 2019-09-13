import express, { Request, Response, NextFunction } from 'express'

import themedb from '../db/themes'

import Theme from '../models/Theme'


const getAllThemes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const themes = await themedb.getAll()
    return res.status(200).send(themes)
  }
  catch(err) {
    next(err)
  }
}
const getThemesFromSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const themes = await themedb.getManyBySubjectid(req.params.subjectid)
    return res.status(200).send(themes)
  }
  catch(err) {
    next(err)
  }
}

const router = express()

router.get('/', getAllThemes)
router.get('/:subjectid', getThemesFromSubject)

export default router
