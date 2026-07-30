import { Router } from 'express';
import { NutritionController } from './nutrition.controller';
import { authenticate } from '../01_auth/auth.middleware';

const router = Router();
const controller = new NutritionController();

router.use(authenticate);

router.get('/summary', controller.getSummary);
router.get('/meals', controller.getLoggedMeals);
router.post('/analyze', controller.analyzeMeal);
router.post('/recommendations', controller.getRecommendations);
router.post('/generate-plan', controller.generateMealPlan);
router.post('/meals', controller.logMeal);
router.post('/meals/:id/duplicate', controller.duplicateMeal);
router.delete('/meals/:id', controller.deleteMeal);

export const nutritionRouter = router;
