import { Router } from 'express';
import { healthRouter } from './v1/health';
import { authRouter } from '../modules/01_auth';
import { profileRouter } from '../modules/02_user_profile';
import { onboardingRouter } from '../modules/03_onboarding';
import { workoutRouter } from '../modules/04_workout_plan';
import { nutritionRouter } from '../modules/06_nutrition';
import { aiCoachRouter } from '../modules/07_ai_coach';
import { progressRouter } from '../modules/08_progress_tracking';

const router = Router();

// Version 1 Routes
router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/onboarding', onboardingRouter);
router.use('/workouts', workoutRouter);
router.use('/nutrition', nutritionRouter);
router.use('/ai-coach', aiCoachRouter);
router.use('/progress', progressRouter);

export const apiRouter = router;
