import { Request, Response, NextFunction } from 'express'

interface ValidateReturnValue {
  isValid: boolean
  err: any
}

export function validatePOST(req: Request, res: Response, next: NextFunction) {
  let errors = {}
  const { text, correct } = req.body

  if (text === undefined)
    errors = Object.assign({}, errors, {
      text: `Required`,
    })
  else {
    const { isValid, err } = validateText(text)
    if (!isValid) errors = Object.assign({}, errors, err)
  }

  if (correct === undefined)
    errors = Object.assign({}, errors, {
      correct: `Required`
    })
  else {
    const { isValid, err } = validateCorrect(correct)
    if (!isValid) errors = Object.assign({}, errors, err)
  }

  if (Object.keys(errors).length > 0)
    return res.status(400).send(errors)
  return next()
}

export function validatePUT(req: Request, res: Response, next: NextFunction) {
  return validatePOST(req, res, next)
}

function validateText(text: any): ValidateReturnValue {
  let errors = {}

  if (typeof(text) !== 'string')
    errors = Object.assign({}, errors, {
      text: `Must be a string`
    })
  else if (text.length === 0)
    errors = Object.assign({}, errors, {
      text: `Can't be empty`
    })

  return {
    isValid: Object.keys(errors).length === 0,
    err: errors,
  }
}

function validateCorrect(correct: any): ValidateReturnValue {
  let errors = {}

  if (typeof(correct) !== 'boolean')
    errors = Object.assign({}, errors, {
      correct: `Must be a boolean`,
    })

  return {
    isValid: Object.keys(errors).length === 0,
    err: errors,
  }
}
