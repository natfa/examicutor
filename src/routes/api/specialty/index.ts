import express from 'express';

import specialtyService from '../../../services/specialty';

const router = express.Router();

router.get('/', specialtyService.getAllSpecialties);

export default router;
