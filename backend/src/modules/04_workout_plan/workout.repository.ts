import { db } from '../../config/database';
import { WorkoutPlan } from './workout.types';

export class WorkoutRepository {
  public async getActivePlan(userId: string): Promise<WorkoutPlan | null> {
    const result = await db.query(
      'SELECT * FROM workout_plans WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      duration: row.duration,
      exercises: typeof row.exercises === 'string' ? JSON.parse(row.exercises) : row.exercises,
      isActive: row.is_active,
      createdAt: row.created_at
    };
  }

  public async createPlan(userId: string, plan: WorkoutPlan): Promise<WorkoutPlan> {
    await db.query('UPDATE workout_plans SET is_active = false WHERE user_id = $1', [userId]);
    const result = await db.query(
      `INSERT INTO workout_plans (user_id, title, duration, exercises, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING *`,
      [userId, plan.title, plan.duration, JSON.stringify(plan.exercises)]
    );
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      duration: row.duration,
      exercises: typeof row.exercises === 'string' ? JSON.parse(row.exercises) : row.exercises,
      isActive: row.is_active,
      createdAt: row.created_at
    };
  }

  public async deactivatePlans(userId: string): Promise<void> {
    await db.query('UPDATE workout_plans SET is_active = false WHERE user_id = $1', [userId]);
  }
}
