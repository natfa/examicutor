import express from 'express';

import questionRoute from './question';
import subjectRoute from './subject';

const router = express.Router();

router.use('/question', questionRoute);
router.use('/subject', subjectRoute);

export default router;
