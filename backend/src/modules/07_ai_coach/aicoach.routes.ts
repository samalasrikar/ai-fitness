import { Router } from 'express';
import { AICoachController } from './aicoach.controller';
import { authenticate } from '../01_auth/auth.middleware';

const router = Router();
const controller = new AICoachController();

router.use(authenticate);

router.get('/history', controller.getHistory);
router.post('/chat', controller.chat);
router.post('/generate-workout', controller.generateWorkout);
router.get('/injury-guard', controller.getInjuryGuard);
router.post('/injury-log', controller.logInjury);
router.get('/exercise-analysis', controller.getExerciseAnalysis);

export const aiCoachRouter = router;
