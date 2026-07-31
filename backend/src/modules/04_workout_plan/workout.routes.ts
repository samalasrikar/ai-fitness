import { Router } from 'express';
import { WorkoutController } from './workout.controller';
import { authenticate } from '../01_auth/auth.middleware';

const router = Router();
const controller = new WorkoutController();

router.use(authenticate);

// Home Summary & Daily Workout Navigation
router.get('/home-summary', controller.getHomeSummary);
router.get('/active', controller.getActive);
router.get('/daily', controller.getDaily);

// Builders & AI Generator
router.post('/generate', controller.generate);
router.post('/generate-ai', controller.generateAI);
router.post('/manual', controller.createManual);
router.post('/reset', controller.reset);

// Replacement, Analytics, Recommendations
router.get('/replace-exercise', controller.replaceExercise);
router.post('/replace-exercise', controller.replaceExercise);
router.get('/analytics', controller.getAnalytics);
router.get('/recommendations', controller.getRecommendations);

// Sessions & History
router.post('/log-session', controller.logSession);
router.get('/history', controller.getHistory);
router.get('/history/:id', controller.getSessionById);
router.delete('/history/:id', controller.deleteHistoryItem);

// Vault Templates
router.get('/templates', controller.getTemplates);
router.post('/templates', controller.createTemplate);
router.delete('/templates/:id', controller.deleteTemplate);

export const workoutRouter = router;
