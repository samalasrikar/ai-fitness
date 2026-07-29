import { db } from '../../config/database';
import { UserProfileEntity, UpsertProfileDTO } from './profile.types';

// ─────────────────────────────────────────────────────────────────────────────
// User Profile Repository – PostgreSQL Access Layer
// ─────────────────────────────────────────────────────────────────────────────

export class ProfileRepository {
  /**
   * Auto-initializes user_profiles schema table
   */
  public async initTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        age INT NOT NULL,
        gender VARCHAR(30) NOT NULL,
        height_cm NUMERIC(5,2) NOT NULL,
        weight_kg NUMERIC(5,2) NOT NULL,
        target_weight_kg NUMERIC(5,2),
        fitness_goal VARCHAR(50) NOT NULL,
        activity_level VARCHAR(50) NOT NULL,
        experience_level VARCHAR(50) NOT NULL,
        dietary_preference VARCHAR(100),
        medical_conditions TEXT[],
        bmr NUMERIC(7,2),
        tdee NUMERIC(7,2),
        target_calories NUMERIC(7,2),
        target_protein_g NUMERIC(7,2),
        target_carbs_g NUMERIC(7,2),
        target_fat_g NUMERIC(7,2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
    `;
    await db.query(query);
  }

  /**
   * Find user profile by user_id
   */
  public async findByUserId(userId: string): Promise<UserProfileEntity | null> {
    const query = `
      SELECT id, user_id, age, gender, height_cm, weight_kg, target_weight_kg,
             fitness_goal, activity_level, experience_level, dietary_preference,
             medical_conditions, bmr, tdee, target_calories, target_protein_g,
             target_carbs_g, target_fat_g, created_at, updated_at
      FROM user_profiles
      WHERE user_id = $1
      LIMIT 1
    `;
    const result = await db.query<UserProfileEntity>(query, [userId]);
    return result.rows[0] || null;
  }

  /**
   * Upsert (insert or update) profile for a user
   */
  public async upsertProfile(
    userId: string,
    dto: UpsertProfileDTO,
    calculatedMetrics: {
      bmr: number;
      tdee: number;
      targetCalories: number;
      proteinGrams: number;
      carbsGrams: number;
      fatGrams: number;
    },
  ): Promise<UserProfileEntity> {
    const query = `
      INSERT INTO user_profiles (
        user_id, age, gender, height_cm, weight_kg, target_weight_kg,
        fitness_goal, activity_level, experience_level, dietary_preference,
        medical_conditions, bmr, tdee, target_calories, target_protein_g,
        target_carbs_g, target_fat_g, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE SET
        age = EXCLUDED.age,
        gender = EXCLUDED.gender,
        height_cm = EXCLUDED.height_cm,
        weight_kg = EXCLUDED.weight_kg,
        target_weight_kg = EXCLUDED.target_weight_kg,
        fitness_goal = EXCLUDED.fitness_goal,
        activity_level = EXCLUDED.activity_level,
        experience_level = EXCLUDED.experience_level,
        dietary_preference = EXCLUDED.dietary_preference,
        medical_conditions = EXCLUDED.medical_conditions,
        bmr = EXCLUDED.bmr,
        tdee = EXCLUDED.tdee,
        target_calories = EXCLUDED.target_calories,
        target_protein_g = EXCLUDED.target_protein_g,
        target_carbs_g = EXCLUDED.target_carbs_g,
        target_fat_g = EXCLUDED.target_fat_g,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const values = [
      userId,
      dto.age,
      dto.gender,
      dto.heightCm,
      dto.weightKg,
      dto.targetWeightKg || null,
      dto.fitnessGoal,
      dto.activityLevel,
      dto.experienceLevel,
      dto.dietaryPreference || null,
      dto.medicalConditions || [],
      calculatedMetrics.bmr,
      calculatedMetrics.tdee,
      calculatedMetrics.targetCalories,
      calculatedMetrics.proteinGrams,
      calculatedMetrics.carbsGrams,
      calculatedMetrics.fatGrams,
    ];

    const result = await db.query<UserProfileEntity>(query, values);
    return result.rows[0];
  }
}
