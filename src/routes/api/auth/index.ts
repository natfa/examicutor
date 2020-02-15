import express from 'express';

import isAuthenticated from '../../../middleware/isAuthenticated';
import isAdmin from '../../../middleware/isAdmin';
import validateLoginCredentials from '../../../validators/auth';
import validateAccountBody from '../../../validators/account';
import authService from '../../../services/auth';

const router = express.Router();

router.get('/', isAuthenticated, authService.getActiveSession);
router.post('/', validateLoginCredentials, authService.authenticate);
router.post('/create', isAdmin, validateAccountBody, authService.createAccount);

export default router;
