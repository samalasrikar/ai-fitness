import { db } from '../../config/database';
import { NotificationItem } from './notification.types';

export class NotificationRepository {
  public async getNotifications(userId: string): Promise<NotificationItem[]> {
    const res = await db.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    if (res.rows.length === 0) {
      // Seed welcome notification if empty
      const n1 = await this.createNotification(userId, 'Welcome to FITAIX!', 'Your AI Adaptive Fitness Engine is active and configured.', 'system');
      const n2 = await this.createNotification(userId, 'Readiness Updated', 'Your readiness score is 85% today (Optimal).', 'ai');
      return [n1, n2];
    }

    return res.rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      title: r.title,
      message: r.message,
      type: r.type,
      isRead: r.is_read,
      createdAt: r.created_at,
    }));
  }

  public async createNotification(userId: string, title: string, message: string, type = 'info'): Promise<NotificationItem> {
    const res = await db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, title, message, type]
    );
    const r = res.rows[0];
    return {
      id: r.id,
      userId: r.user_id,
      title: r.title,
      message: r.message,
      type: r.type,
      isRead: r.is_read,
      createdAt: r.created_at,
    };
  }

  public async markAsRead(userId: string, id: string): Promise<boolean> {
    const res = await db.query('UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2', [id, userId]);
    return (res.rowCount ?? 0) > 0;
  }
}
