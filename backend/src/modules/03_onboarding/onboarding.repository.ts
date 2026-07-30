import { db } from '../../config/database';
import { OnboardingDTO, OnboardingRecord } from './onboarding.types';

export class OnboardingRepository {
  public async upsert(userId: string, dto: OnboardingDTO): Promise<OnboardingRecord> {
    const query = `
      INSERT INTO onboarding_protocols (
        user_id, gender, age, weight, height_ft, height_in,
        fitness_level, frequency, location, duration, selected_goal, is_completed, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE SET
        gender = COALESCE(EXCLUDED.gender, onboarding_protocols.gender),
        age = COALESCE(EXCLUDED.age, onboarding_protocols.age),
        weight = COALESCE(EXCLUDED.weight, onboarding_protocols.weight),
        height_ft = COALESCE(EXCLUDED.height_ft, onboarding_protocols.height_ft),
        height_in = COALESCE(EXCLUDED.height_in, onboarding_protocols.height_in),
        fitness_level = COALESCE(EXCLUDED.fitness_level, onboarding_protocols.fitness_level),
        frequency = COALESCE(EXCLUDED.frequency, onboarding_protocols.frequency),
        location = COALESCE(EXCLUDED.location, onboarding_protocols.location),
        duration = COALESCE(EXCLUDED.duration, onboarding_protocols.duration),
        selected_goal = COALESCE(EXCLUDED.selected_goal, onboarding_protocols.selected_goal),
        is_completed = COALESCE(EXCLUDED.is_completed, onboarding_protocols.is_completed),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const values = [
      userId,
      dto.gender || null,
      dto.age || null,
      dto.weight || null,
      dto.heightFt || null,
      dto.heightIn || null,
      dto.fitnessLevel || null,
      dto.frequency || null,
      dto.location || null,
      dto.duration || null,
      dto.selectedGoal || null,
      dto.isCompleted ?? true
    ];

    const result = await db.query(query, values);
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      gender: row.gender,
      age: row.age,
      weight: row.weight ? parseFloat(row.weight) : undefined,
      heightFt: row.height_ft,
      heightIn: row.height_in,
      fitnessLevel: row.fitness_level,
      frequency: row.frequency,
      location: row.location,
      duration: row.duration,
      selectedGoal: row.selected_goal,
      isCompleted: row.is_completed,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  public async findByUserId(userId: string): Promise<OnboardingRecord | null> {
    const result = await db.query('SELECT * FROM onboarding_protocols WHERE user_id = $1', [userId]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      gender: row.gender,
      age: row.age,
      weight: row.weight ? parseFloat(row.weight) : undefined,
      heightFt: row.height_ft,
      heightIn: row.height_in,
      fitnessLevel: row.fitness_level,
      frequency: row.frequency,
      location: row.location,
      duration: row.duration,
      selectedGoal: row.selected_goal,
      isCompleted: row.is_completed,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}
