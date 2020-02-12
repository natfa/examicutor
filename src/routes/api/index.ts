import express from 'express';

import questionRoute from './question';
import subjectRoute from './subject';
import themeRoute from './theme';

const router = express.Router();

router.use('/question', questionRoute);
router.use('/subject', subjectRoute);
router.use('/theme', themeRoute);

export default router;
