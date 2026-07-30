import { Router } from 'express';
import { NutritionController } from './nutrition.controller';
import { authenticateToken } from '../01_auth/auth.middleware';

const router = Router();
const controller = new NutritionController();

router.get('/meals', authenticateToken, controller.getMeals);
router.post('/analyze', authenticateToken, controller.analyze);
router.post('/log', authenticateToken, controller.logMeal);

export const nutritionRouter = router;
