import { Router } from 'express';
import { healthRouter } from './v1/health';
import { authRouter } from './v1/auth';
import { userRouter } from './v1/user';
import { dashboardRouter } from './v1/dashboard';
import { recoveryRouter } from './v1/recovery';
import { workoutRouter } from './v1/workout';
import { recordsRouter } from './v1/records';

const router = Router();

// Version 1 Routes
router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/dashboard', dashboardRouter);
router.use('/recovery', recoveryRouter);
router.use('/workout', workoutRouter);
router.use('/records', recordsRouter);

export const apiRouter = router;
