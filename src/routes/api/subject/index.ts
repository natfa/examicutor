import express from 'express';

import isAuthenticated from '../../../middleware/isAuthenticated';
import subjectService from '../../../services/subject';

const router = express.Router();

router.use(isAuthenticated);

router.get('/', subjectService.getSubjects);

export default router;
