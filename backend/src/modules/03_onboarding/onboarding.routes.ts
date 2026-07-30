import { Router } from 'express';
import { OnboardingController } from './onboarding.controller';
import { authenticateToken } from '../01_auth/auth.middleware';

const router = Router();
const controller = new OnboardingController();

router.post('/complete', authenticateToken, controller.save);
router.get('/status', authenticateToken, controller.getStatus);

export const onboardingRouter = router;
