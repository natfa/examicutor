import { Request, Response, NextFunction } from 'express'

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session)
        return next(new Error('req.session is undefined'))

    if (!req.session.isAuthenticated)
        return res.status(401).send('Unauthorized')
    return next()
}

export default isAuthenticated