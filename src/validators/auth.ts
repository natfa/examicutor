import { Request, Response, NextFunction } from 'express'

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

const validateEmail = (email: any) => {
    let errors = {}

    if (typeof(email) !== 'string') {
        errors = Object.assign({}, errors, {
            email: `Must be a string`,
        })
    } else if (email.length === 0) {
        errors = Object.assign({}, errors, {
            email: `Can't be empty`
        })
    } else if (email.length >= 50 || !isEmail(email)) {
        errors = Object.assign({}, errors, {
            email: `Please provide a valid email`
        })
    }

    return errors
}

const validatePassword = (password: any) => {
    let errors = {}

    if (typeof(password) !== 'string') {
        errors = Object.assign({}, errors, {
            password: `Must be a string`
        })
    } else if (password.length === 0) {
        errors = Object.assign({}, errors, {
            password: `Can't be empty`
        })
    }

    return errors
}

const isEmail = (email: string) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}