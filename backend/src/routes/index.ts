import { Router } from 'express';
import { healthRouter } from './v1/health';
import { authRouter } from '../modules/01_auth';
import { profileRouter } from '../modules/02_user_profile';
import { onboardingRouter } from '../modules/03_onboarding';
import { workoutRouter } from '../modules/04_workout_plan';
import { exerciseRouter } from '../modules/05_exercise_library';
import { nutritionRouter } from '../modules/06_nutrition';
import { aiCoachRouter } from '../modules/07_ai_coach';
import { progressRouter } from '../modules/08_progress_tracking';
import { analyticsRouter } from '../modules/09_analytics';
import { notificationRouter } from '../modules/12_notifications';

import { aiRouter } from './v1/ai';
import { dashboardRouter } from './v1/dashboard';

const router = Router();

// Version 1 Routes
router.use('/health', healthRouter);
router.use('/ai', aiRouter);
router.use('/auth', authRouter);
router.use('/dashboard', dashboardRouter);
router.use('/profile', profileRouter);
router.use('/onboarding', onboardingRouter);
router.use('/workouts', workoutRouter);
router.use('/exercises', exerciseRouter);
router.use('/nutrition', nutritionRouter);
router.use('/ai-coach', aiCoachRouter);
router.use('/progress', progressRouter);
router.use('/analytics', analyticsRouter);
router.use('/notifications', notificationRouter);

export const apiRouter = router;
