import { Response, NextFunction } from 'express';
import { NotificationService } from './notification.service';
import { AuthenticatedRequest } from '../01_auth/auth.types';
import { ApiResponse } from '../../utils/ApiResponse';

export class NotificationController {
  private readonly service = new NotificationService();

  public getNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const notifications = await this.service.getNotifications(userId);
      res.status(200).json(ApiResponse.success('Notifications retrieved', notifications));
    } catch (error) {
      next(error);
    }
  };

  public markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.service.markAsRead(userId, id);
      res.status(200).json(ApiResponse.success('Notification marked as read'));
    } catch (error) {
      next(error);
    }
  };
}
