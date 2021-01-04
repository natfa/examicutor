import express from 'express';

import isStudent from '../../../middleware/isStudent';
import solveService from '../../../services/solve';

const router = express.Router();

router.use(isStudent);

router.get('/:examId', solveService.getExamById);
router.post('/answer', solveService.saveAnswer);
router.post('/submit', solveService.submitExam);

export default router;
