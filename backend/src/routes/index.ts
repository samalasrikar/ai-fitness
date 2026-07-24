import { Router } from 'express';
import { healthRouter } from './v1/health';

const router = Router();

// Version 1 Routes
router.use('/health', healthRouter);

export const apiRouter = router;
