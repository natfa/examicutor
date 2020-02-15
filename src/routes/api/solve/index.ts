import express from 'express';

import isStudent from '../../../middleware/isStudent';
import validateSaveAnswerBody from '../../../validators/solve';
import solveService from '../../../services/solve';

const router = express.Router();

router.use(isStudent);

router.get('/:examId', solveService.getExamById);
router.post('/answer', validateSaveAnswerBody, solveService.saveAnswer);
router.post('/submit', solveService.submitExam);

export default router;
