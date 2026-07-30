import { db } from '../../config/database';
import { DashboardMetrics } from './progress.types';

export class ProgressRepository {
  public async getMetrics(userId: string): Promise<DashboardMetrics> {
    const result = await db.query('SELECT * FROM user_streaks WHERE user_id = $1', [userId]);
    let activeDays = 14;
    let joined = false;

    if (result.rows.length > 0) {
      activeDays = result.rows[0].active_days_count || 14;
      joined = Boolean(result.rows[0].has_joined_challenge);
    } else {
      await db.query(
        'INSERT INTO user_streaks (user_id, active_days_count, has_joined_challenge) VALUES ($1, 14, false) ON CONFLICT DO NOTHING',
        [userId]
      );
    }

    return {
      heartRate: 78,
      steps: 8425,
      energy: 2450,
      hydration: 1.8,
      activeBurn: 480,
      activeStreak: activeDays,
      hasJoinedChallenge: joined
    };
  }

  public async toggleChallenge(userId: string): Promise<boolean> {
    const current = await this.getMetrics(userId);
    const updated = !current.hasJoinedChallenge;
    await db.query(
      `INSERT INTO user_streaks (user_id, has_joined_challenge) VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET has_joined_challenge = EXCLUDED.has_joined_challenge, updated_at = CURRENT_TIMESTAMP`,
      [userId, updated]
    );
    return updated;
  }
}
