import { Router } from 'express';
import { ProgressController } from './progress.controller';
import { authenticateToken } from '../01_auth/auth.middleware';

const router = Router();
const controller = new ProgressController();

router.get('/dashboard', authenticateToken, controller.getMetrics);
router.post('/challenge/toggle', authenticateToken, controller.toggleChallenge);

export const progressRouter = router;
