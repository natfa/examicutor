import { Request, Response, NextFunction } from 'express'

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session)
        return next(new Error('req.session is undefined'))

    if (!req.session.account.isAdmin)
        return res.status(403).send('Forbidden')
    return next()
}

export default isAdmin
