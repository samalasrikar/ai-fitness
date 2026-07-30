import { db } from '../../config/database';
import { WorkoutPlan, WorkoutSession, WorkoutTemplate, LogSessionInput, CreateTemplateInput } from './workout.types';

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
      createdAt: row.created_at,
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
      createdAt: row.created_at,
    };
  }

  public async deactivatePlans(userId: string): Promise<void> {
    await db.query('UPDATE workout_plans SET is_active = false WHERE user_id = $1', [userId]);
  }

  // ── Workout Sessions ────────────────────────────────────────────────────────
  public async createSession(userId: string, input: LogSessionInput): Promise<WorkoutSession> {
    const calculatedVolume = input.sets?.reduce((acc, s) => acc + Number(s.weightKg || 0) * Number(s.reps || 0), 0) || 0;
    const volume = input.totalVolumeKg || calculatedVolume;
    const calories = input.caloriesBurned || Math.round((input.durationSeconds / 60) * 8.5);

    const sessionRes = await db.query(
      `INSERT INTO workout_sessions (user_id, title, duration_seconds, total_volume_kg, calories_burned, rpe_avg, ai_feedback, rating)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, input.title, input.durationSeconds, volume, calories, input.rpeAvg || 8.0, input.aiFeedback || 'Great work! Progressive load maintained.', input.rating || 5]
    );

    const sessionRow = sessionRes.rows[0];

    const sets = [];
    if (input.sets && input.sets.length > 0) {
      for (const set of input.sets) {
        const setRes = await db.query(
          `INSERT INTO workout_session_sets (session_id, exercise_name, set_number, weight_kg, reps, rpe, completed)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [sessionRow.id, set.exerciseName, set.setNumber, set.weightKg, set.reps, set.rpe || 8.0, set.completed ?? true]
        );
        const sRow = setRes.rows[0];
        sets.push({
          id: sRow.id,
          sessionId: sRow.session_id,
          exerciseName: sRow.exercise_name,
          setNumber: sRow.set_number,
          weightKg: Number(sRow.weight_kg),
          reps: Number(sRow.reps),
          rpe: Number(sRow.rpe),
          completed: sRow.completed,
        });
      }
    }

    return {
      id: sessionRow.id,
      userId: sessionRow.user_id,
      title: sessionRow.title,
      durationSeconds: Number(sessionRow.duration_seconds),
      totalVolumeKg: Number(sessionRow.total_volume_kg),
      caloriesBurned: Number(sessionRow.calories_burned),
      rpeAvg: Number(sessionRow.rpe_avg),
      aiFeedback: sessionRow.ai_feedback,
      rating: Number(sessionRow.rating),
      createdAt: sessionRow.created_at,
      sets,
    };
  }

  public async getSessions(userId: string, limit = 50): Promise<WorkoutSession[]> {
    const result = await db.query(
      'SELECT * FROM workout_sessions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      durationSeconds: Number(row.duration_seconds),
      totalVolumeKg: Number(row.total_volume_kg),
      caloriesBurned: Number(row.calories_burned),
      rpeAvg: Number(row.rpe_avg),
      aiFeedback: row.ai_feedback,
      rating: Number(row.rating),
      createdAt: row.created_at,
    }));
  }

  public async getSessionById(userId: string, sessionId: string): Promise<WorkoutSession | null> {
    const sRes = await db.query('SELECT * FROM workout_sessions WHERE id = $1 AND user_id = $2', [sessionId, userId]);
    if (sRes.rows.length === 0) return null;
    const row = sRes.rows[0];

    const setsRes = await db.query('SELECT * FROM workout_session_sets WHERE session_id = $1 ORDER BY set_number ASC', [sessionId]);
    const sets = setsRes.rows.map((sRow) => ({
      id: sRow.id,
      sessionId: sRow.session_id,
      exerciseName: sRow.exercise_name,
      setNumber: sRow.set_number,
      weightKg: Number(sRow.weight_kg),
      reps: Number(sRow.reps),
      rpe: Number(sRow.rpe),
      completed: sRow.completed,
    }));

    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      durationSeconds: Number(row.duration_seconds),
      totalVolumeKg: Number(row.total_volume_kg),
      caloriesBurned: Number(row.calories_burned),
      rpeAvg: Number(row.rpe_avg),
      aiFeedback: row.ai_feedback,
      rating: Number(row.rating),
      createdAt: row.created_at,
      sets,
    };
  }

  public async deleteSession(userId: string, sessionId: string): Promise<boolean> {
    const res = await db.query('DELETE FROM workout_sessions WHERE id = $1 AND user_id = $2', [sessionId, userId]);
    return (res.rowCount ?? 0) > 0;
  }

  // ── Workout Templates (Training Vault) ──────────────────────────────────────
  public async getTemplates(userId: string): Promise<WorkoutTemplate[]> {
    const result = await db.query('SELECT * FROM workout_templates WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      category: row.category,
      estimatedDurationMin: Number(row.estimated_duration_min),
      difficulty: row.difficulty,
      exercises: typeof row.exercises === 'string' ? JSON.parse(row.exercises) : row.exercises,
      createdAt: row.created_at,
    }));
  }

  public async createTemplate(userId: string, input: CreateTemplateInput): Promise<WorkoutTemplate> {
    const result = await db.query(
      `INSERT INTO workout_templates (user_id, title, category, estimated_duration_min, difficulty, exercises)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        userId,
        input.title,
        input.category || 'Custom',
        input.estimatedDurationMin || 45,
        input.difficulty || 'Intermediate',
        JSON.stringify(input.exercises || []),
      ]
    );
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      category: row.category,
      estimatedDurationMin: Number(row.estimated_duration_min),
      difficulty: row.difficulty,
      exercises: typeof row.exercises === 'string' ? JSON.parse(row.exercises) : row.exercises,
      createdAt: row.created_at,
    };
  }

  public async deleteTemplate(userId: string, templateId: string): Promise<boolean> {
    const res = await db.query('DELETE FROM workout_templates WHERE id = $1 AND user_id = $2', [templateId, userId]);
    return (res.rowCount ?? 0) > 0;
  }
}
