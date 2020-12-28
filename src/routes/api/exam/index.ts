import express from 'express';

import isAuthenticated from '../../../middleware/isAuthenticated';
import isTeacher from '../../../middleware/isTeacher';
import examService from '../../../services/exam';

const router = express.Router();

router.use(isAuthenticated);

router.get('/', examService.getAllExams);
router.get('/upcoming', examService.getUpcomingExams);
router.get('/past', examService.getPastExams);
router.get('/:examId', examService.getExamById);

router.get('/:examId/results', examService.getExamResults);
router.get('/:examId/results/:studentId', examService.getStudentExamResults);

router.post('/', isTeacher, examService.createNewExam);

export default router;
