import express from 'express';

import isAuthenticated from '../../../middleware/isAuthenticated';
import moduleService from '../../../services/module';

const router = express.Router();

router.use(isAuthenticated);

router.get('/', moduleService.getModules);

export default router;
