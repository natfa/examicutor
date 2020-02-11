import express from 'express';

import questionRoute from './question';

const router = express.Router();

router.use('/question', questionRoute);

export default router;
