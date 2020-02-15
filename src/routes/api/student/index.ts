import express from 'express';

import isAuthenticated from '../../../middleware/isAuthenticated';
import studentService from '../../../services/student';

const router = express.Router();

router.use(isAuthenticated);

router.get('/', studentService.getStudent);

export default router;
