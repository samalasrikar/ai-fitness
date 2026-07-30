import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { authenticate } from '../01_auth/auth.middleware';

const router = Router();
const controller = new NotificationController();

router.use(authenticate);

router.get('/', controller.getNotifications);
router.put('/:id/read', controller.markAsRead);

export const notificationRouter = router;
