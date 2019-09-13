import express, { Request, Response, NextFunction } from 'express'

export const validateSubjectBody = (req: Request, res: Response, next: NextFunction) => {
  let errors = {}
  const { name } = req.body

  if (name === undefined)
    errors = Object.assign({}, errors, { name: `Required` })
  else
    errors = Object.assign({}, errors, validateName(name))

  if (Object.keys(errors).length > 0)
    return res.status(400).send(errors)
  return next()
}

const validateName = (name: any) => {
  let errors = {}

  if (typeof(name) !== 'string')
    errors = Object.assign({}, errors, {
      name: `Must be a string`
    })
  else if (name.length <= 0)
    errors = Object.assign({}, errors, {
      name: `Can't be empty`
    })

  return errors
}
