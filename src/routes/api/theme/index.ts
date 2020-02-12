import express from 'express';

import themeService from '../../../services/theme';
import isAuthenticated from '../../../middleware/isAuthenticated';

const router = express.Router();

router.use(isAuthenticated);

router.get('/:subjectid', themeService.getThemesBySubjectId);

export default router;
