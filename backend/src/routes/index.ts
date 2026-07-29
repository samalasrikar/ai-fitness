import { Router } from 'express';
import { healthRouter } from './v1/health';
import { authRouter } from '../modules/01_auth';
import { profileRouter } from '../modules/02_user_profile';

const router = Router();

// Version 1 Routes
router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/profile', profileRouter);

export const apiRouter = router;
