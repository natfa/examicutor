import express from 'express';

import themeService from '../../../services/theme';
import isAuthenticated from '../../../middleware/isAuthenticated';

const router = express.Router();

router.use(isAuthenticated);

router.get('/:moduleId', themeService.getThemesByModuleId);

export default router;
