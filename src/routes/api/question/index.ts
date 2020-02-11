import express from 'express';
import multer from 'multer';

import questionService from '../../../services/question';

import isTeacher from '../../../middleware/isTeacher';
import validateQuestionBody from '../../../validators/question';

const router = express.Router();
const uploadHandler = multer({ dest: 'uploads' });

router.use(isTeacher);

router.get('/', questionService.getQuestions);
router.get('/:id', questionService.getQuestionById);

router.post(
  '/',
  uploadHandler.array('media'),
  validateQuestionBody,
  questionService.ensureSubject,
  questionService.ensureTheme,
  questionService.createQuestion,
);

router.put(
  '/',
  uploadHandler.array('media'),
  validateQuestionBody,
  questionService.ensureSubject,
  questionService.ensureTheme,
  questionService.updateQuestion,
);

router.delete('/:id', questionService.deleteQuestion);

export default router;
