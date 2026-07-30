import { Router } from 'express';
import { WorkoutController } from './workout.controller';
import { authenticateToken } from '../01_auth/auth.middleware';

const router = Router();
const controller = new WorkoutController();

router.get('/active', authenticateToken, controller.getActive);
router.post('/generate', authenticateToken, controller.generate);
router.delete('/active', authenticateToken, controller.reset);

export const workoutRouter = router;
