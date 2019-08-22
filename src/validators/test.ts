import { Request, Response, NextFunction } from 'express'

interface ValidatorReturnValue {
  isValid: boolean
  errs: any
}

const isInt = (n: number): boolean => {
  return n % 1 === 0
}

export const validateQuery = (req: Request, res: Response, next: NextFunction) => {
  const { total, subjects } = req.query
  console.log(subjects)
  let errors = {}

  if (total === undefined || total === null)
    errors = Object.assign({}, errors, {
      total: `Required`,
    })
  else {
    const { isValid, errs } = validateTotal(total)
    if (!isValid)
      errors = Object.assign({}, errors, errs)
  }

  if (subjects !== undefined || subjects !== null) {
    const { isValid, errs } = validateSubjects(subjects)
    if (!isValid)
      errors = Object.assign({}, errors, errs)
  }

  if (Object.keys(errors).length !== 0)
    return res.status(404).send(errors)
  return next()
}

const validateTotal = (total: any): ValidatorReturnValue => {
  let errors = {}

  if (!isInt(total))
    errors = Object.assign({}, errors, {
      total: `Must be a whole number`,
    })
  else if (total < 0)
    errors = Object.assign({}, errors, {
      total: `Must be higher than 0`,
    })

  return {
    isValid: Object.keys(errors).length === 0,
    errs: errors,
  }
}

const validateSubjects = (subjects: any): ValidatorReturnValue => {
  let errors = {}

  if (typeof(subjects) !== 'object' || Array.isArray(subjects)) {
    errors = Object.assign({}, errors, {
      subjects: `Must be an object`,
    })
    return {
      isValid: false,
      errs: errors,
    }
  }

  for (let key in subjects) {
    // If a value is not a number, add error and break out, no need to waste CPU cycles.
    if (isNaN(Number(subjects[key]))) {
      errors = Object.assign({}, errors, {
        subjects: `All subject values must be numbers`,
      })
      break
    }
  }

  return {
    isValid: false,
    errs: errors,
  }
}
