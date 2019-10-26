import { Request, Response, NextFunction } from 'express';

import removeUploadedFiles from '../utils/removeUploadedFiles';

interface ValidatorReturnValue {
  isValid: boolean;
  err: any;
}

export const validateFilters = (req: Request, res: Response, next: NextFunction) => {
  let errors = {}
  const { subjectid, text } = req.params

  if (subjectid === undefined) {
    errors = Object.assign({}, errors, { subject: `Required` })
  } else {
    // Important: This is currently using the same method to check the subject name
    // If the id of the subject changes, this should be changed as well
    const { isValid, err } = validateSubject(subjectid)
  }

  if (text !== undefined) {
    const { isValid, err } = validateText(text)
  }

  if (Object.keys(errors).length > 0)
    return res.status(400).send(errors)
  return next()
}

export const validateQuestionBody = (req: Request, res: Response, next: NextFunction) => {
  let errors = {}
  const {
    text,
    points,
    subjectName,
    themeName,
    correctAnswers,
    incorrectAnswers
  } = req.body;

  if (text === undefined){
    errors = Object.assign({}, errors, { text: `Required` })
  } else {
    const { isValid, err } = validateText(text)
    if (!isValid)
      errors = Object.assign({}, errors, err)
  }

  if (points === undefined) {
    errors = Object.assign({}, errors, { points: `Required` })
  } else {
    const { isValid, err } = validatePoints(points)
    if (!isValid)
      errors = Object.assign({}, errors, err)
  }

  if (incorrectAnswers === undefined) {
    errors = Object.assign({}, errors, { incorrectAnswers: `Required` })
  } else {
    const { isValid, err } = validateAnswers(incorrectAnswers)
    if (!isValid)
      errors = Object.assign({}, errors, err)
  }

  if (correctAnswers === undefined) {
    errors = Object.assign({}, errors, { correctAnswers: `Required` })
  } else {
    const { isValid, err } = validateAnswers(correctAnswers)
    if (!isValid)
      errors = Object.assign({}, errors, err)
  }

  if (subjectName === undefined) {
    errors = Object.assign({}, errors, { subjectName: `Required` })
  } else {
    const { isValid, err } = validateSubject(subjectName)
    if (!isValid)
      errors = Object.assign({}, errors, err)
  }

  if (themeName !== undefined) {
    const { isValid, err } = validateTheme(themeName)
    if (!isValid)
      errors = Object.assign({}, errors, err)
  }

  if (Object.keys(errors).length > 0) {
    // cleanup
    const filenames = (req.files as Express.Multer.File[])
      .map((file) => file.filename);
    removeUploadedFiles(...filenames);

    return res.status(400).send(errors)
  }
  return next()
}

const validateText = (text: any): ValidatorReturnValue => {
  let errors = {}

  if (typeof(text) !== 'string')
    errors = Object.assign({}, errors, {
      text: `Must be string`,
    })
  else if (text.length > 150)
    errors = Object.assign({}, errors, {
      text: `Max length: 150`,
    })
  else if (text.length <= 2)
    errors = Object.assign({}, errors, {
      text: `Can't be less than 3 characters`,
    })

  return {
    isValid: Object.keys(errors).length === 0,
    err: errors,
  }
}

const validateAnswers = (answers: any): ValidatorReturnValue => {
  let errors = {}

  if (!Array.isArray(answers))
    errors = Object.assign({}, errors, {
      answers: `Must be array`,
    })
  else if (answers.length === 0)
    errors = Object.assign({}, errors, {
      answers: `At least 1 correct and 1 incorrect answers are required`,
    })
  else {
    for (let i = 0, len = answers.length; i < len; i++) {
      // save the error and break the loop, no need to check all values if one is incorrect
      if (typeof(answers[i]) !== 'string') {
        errors = Object.assign({}, errors, {
          answers: `All answers must be string`,
        })
        break
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    err: errors,
  }
}

const validatePoints = (points: any): ValidatorReturnValue => {
  let errors = {}

  if (typeof(points) !== 'number' && isNaN(Number(points)))
    errors = Object.assign({}, errors, {
      points: `Must be a number`,
    })
  else if (points < 0)
    errors = Object.assign({}, errors, {
      points: `Can't be negative`
    })

  return {
    isValid: Object.keys(errors).length === 0,
    err: errors,
  }
}

const validateSubject = (subject: any): ValidatorReturnValue => {
  let errors = {}

  if (typeof(subject) !== 'string')
    errors = Object.assign({}, errors, {
      subject: `Must be a string`,
    })
  else if(subject.length === 0)
    errors = Object.assign({}, errors, {
      subject: `Can't be empty`,
    })

  return {
    isValid: Object.keys(errors).length === 0,
    err: errors,
  }
}

const validateTheme = (theme: any): ValidatorReturnValue => {
  let errors = {}

  if (typeof(theme) !== 'string')
    errors = Object.assign({}, errors, {
      theme: `Must be a string`,
    })
  else if (theme.length === 0)
    errors = Object.assign({}, errors, {
      theme: `Can't be empty`,
    })

  return {
    isValid: Object.keys(errors).length === 0,
    err: errors,
  }
}
