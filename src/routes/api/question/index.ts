import express from 'express';

import questionService from '../../../services/question';

import isTeacher from '../../../middleware/isTeacher';

const router = express.Router();

router.use(isTeacher);

router.get('/', questionService.getQuestions);
router.get('/:id', questionService.getQuestionById);
router.post( '/', questionService.createQuestion);
router.put( '/', questionService.updateQuestion);
router.delete('/:id', questionService.deleteQuestion);

export default router;
