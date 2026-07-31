import { Router } from 'express';
import { ProgressController } from './progress.controller';
import { authenticate } from '../01_auth/auth.middleware';

const router = Router();
const controller = new ProgressController();

router.use(authenticate);

router.get('/dashboard', controller.getMetrics);
router.get('/dashboard-summary', controller.getDashboardSummary);
router.post('/challenge/toggle', controller.toggleChallenge);

router.get('/records/summary', controller.getRecordsSummary);
router.get('/records', controller.getPersonalRecords);
router.post('/records', controller.createPersonalRecord);
router.delete('/records/:id', controller.deletePersonalRecord);

export const progressRouter = router;
