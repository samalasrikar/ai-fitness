import { Router, Response, NextFunction } from 'express';
import { authenticate } from '../../modules/01_auth/auth.middleware';
import { AuthenticatedRequest } from '../../modules/01_auth/auth.types';
import { ApiResponse } from '../../utils/ApiResponse';
import { AIService } from '../../utils/ai.service';
import { logger } from '../../config/logger';

const router = Router();
router.use(authenticate);

/**
 * POST /api/v1/ai/chat
 * AI Chat Assistant Endpoint
 */
router.post('/chat', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { text, message, history } = req.body;
    const promptText = text || message;
    logger.info('[AI Router] Incoming AI Chat request', { userId: req.user?.userId });
    const reply = await AIService.generateCoachReply(promptText, history || []);
    res.status(200).json(ApiResponse.success('AI Coach reply generated', { reply, message: reply, text: reply }));
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/ai/meal-analysis
 * AI Meal Analysis Endpoint
 */
router.post('/meal-analysis', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { description, mealText } = req.body;
    const mealInput = description || mealText;
    logger.info('[AI Router] Incoming Meal Analysis request', { userId: req.user?.userId });
    const analysis = await AIService.analyzeMealWithAI(mealInput);
    res.status(200).json(ApiResponse.success('Meal analyzed by AI', analysis));
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/ai/workout
 * AI Workout Blueprint Endpoint
 */
router.post('/workout', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { focusArea, targetDuration, equipment, energyLevel } = req.body;
    logger.info('[AI Router] Incoming AI Workout request', { userId: req.user?.userId });
    const plan = await AIService.generateWorkoutPlanWithAI({
      focusArea,
      targetDuration,
      equipment,
      energyLevel,
    });
    res.status(200).json(ApiResponse.success('AI Workout generated', plan));
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/ai/nutrition
 * AI Nutrition Recommendations Endpoint
 */
router.post('/nutrition', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    logger.info('[AI Router] Incoming AI Nutrition Recommendations request', { userId: req.user?.userId });
    const nutritionPlan = await AIService.generateNutritionRecommendationsWithAI(req.body);
    res.status(200).json(ApiResponse.success('AI Nutrition plan generated', nutritionPlan));
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/ai/recommendations
 * AI Goal Drift & Strategic Recommendations Endpoint
 */
router.post('/recommendations', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    logger.info('[AI Router] Incoming AI Recommendations request', { userId: req.user?.userId });
    const recommendations = await AIService.generateGoalDriftRecommendationsWithAI(req.body);
    res.status(200).json(ApiResponse.success('AI Recommendations generated', recommendations));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/ai/insights
 * AI Progress Insights Endpoint
 */
router.get('/insights', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    logger.info('[AI Router] Incoming AI Insights request', { userId: req.user?.userId });
    const insights = await AIService.generateProgressInsightsWithAI({ userId: req.user?.userId });
    res.status(200).json(ApiResponse.success('AI Insights generated', insights));
  } catch (error) {
    next(error);
  }
});

export const aiRouter = router;
