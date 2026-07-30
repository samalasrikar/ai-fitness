import { NotificationRepository } from './notification.repository';
import { NotificationItem } from './notification.types';

export class NotificationService {
  private readonly repo = new NotificationRepository();

  public async getNotifications(userId: string): Promise<NotificationItem[]> {
    return this.repo.getNotifications(userId);
  }

  public async markAsRead(userId: string, id: string): Promise<boolean> {
    return this.repo.markAsRead(userId, id);
  }
}
