import { Router } from 'express';
import { AICoachController } from './aicoach.controller';
import { authenticateToken } from '../01_auth/auth.middleware';

const router = Router();
const controller = new AICoachController();

router.get('/history', authenticateToken, controller.getHistory);
router.post('/chat', authenticateToken, controller.chat);

export const aiCoachRouter = router;
