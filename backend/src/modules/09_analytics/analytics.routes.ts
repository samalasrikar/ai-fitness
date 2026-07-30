import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { authenticate } from '../01_auth/auth.middleware';

const router = Router();
const controller = new AnalyticsController();

router.use(authenticate);

router.get('/overload', controller.getOverload);
router.get('/performance-lab', controller.getPerformanceLab);
router.get('/goal-drift', controller.getGoalDrift);
router.get('/workout-recommendations', controller.getWorkoutRecommendations);
router.get('/nutrition-recommendations', controller.getNutritionRecommendations);

export const analyticsRouter = router;
