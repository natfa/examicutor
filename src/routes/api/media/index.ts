import express from 'express';

import isAuthenticated from '../../../middleware/isAuthenticated';
import mediaService from '../../../services/media';

const router = express.Router();

router.use(isAuthenticated);

router.get('/:questionId', mediaService.getMediaByQuestionId);

export default router;
