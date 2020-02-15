import express from 'express';

import questionRoute from './question';
import subjectRoute from './subject';
import themeRoute from './theme';
import authRoute from './auth';
import mediaRoute from './media';
import specialtyRoute from './specialty';
import studentRoute from './student';
import examRoute from './exam';
import solveRoute from './solve';

const router = express.Router();

router.use('/question', questionRoute);
router.use('/subject', subjectRoute);
router.use('/theme', themeRoute);
router.use('/auth', authRoute);
router.use('/media', mediaRoute);
router.use('/exam', examRoute);
router.use('/specialty', specialtyRoute);
router.use('/student', studentRoute);
router.use('/solve', solveRoute);

export default router;
