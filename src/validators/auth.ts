import { Request, Response, NextFunction } from 'express'
import { validateEmail, validatePassword } from './account'

export const validateLoginCredentials = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    let errors = {}

    if (email === undefined) {
        errors = Object.assign({}, errors, {
            email: `Required`
        })
    } else {
        errors = Object.assign({}, errors, validateEmail(email))
    }

    if (password === undefined) {
        errors = Object.assign({}, errors, {
            password: `Required`
        })
    } else {
        errors = Object.assign({}, errors, validatePassword(password))
    }

    console.log(errors)

    if (Object.keys(errors).length !== 0)
        return res.status(400).send(errors)
    return next()
}