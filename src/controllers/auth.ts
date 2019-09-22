import express, { Request, Response, NextFunction } from 'express'
import { validateLoginCredentials } from '../validators/auth'
import { isAuthenticated } from '../middleware/isAuthenticated'
import { isAdmin } from '../middleware/isAdmin'

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  return next('Not Implemented')
}

const createAccount = async(req: Request, res: Response, next: NextFunction) => {
  return next('Not Implemented')
}

const router = express.Router()

// The validateLoginCredentials only checks for gramatical errors,
// such as mistyped email or an empty password. The authenticate
// method actually makes the authentication and checks the DB
router.post('/', validateLoginCredentials, authenticate)
router.post('/create', isAuthenticated, isAdmin, createAccount)

export default router