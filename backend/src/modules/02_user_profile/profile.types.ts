import { Request } from 'express';

// ─────────────────────────────────────────────────────────────────────────────
// User Profile Types & DTOs
// ─────────────────────────────────────────────────────────────────────────────

export type AuthenticatedRequest = Request;

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export type FitnessGoal = 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'MAINTENANCE' | 'ENDURANCE' | 'STRENGTH';
export type ActivityLevel = 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTRA_ACTIVE';
export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface UserProfileEntity {
  id: string;
  user_id: string;
  age: number;
  gender: Gender;
  height_cm: number;
  weight_kg: number;
  target_weight_kg: number | null;
  fitness_goal: FitnessGoal;
  activity_level: ActivityLevel;
  experience_level: ExperienceLevel;
  dietary_preference: string | null;
  medical_conditions: string[] | null;
  bmr: number | null;
  tdee: number | null;
  target_calories: number | null;
  target_protein_g: number | null;
  target_carbs_g: number | null;
  target_fat_g: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface UpsertProfileDTO {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  targetWeightKg?: number;
  fitnessGoal: FitnessGoal;
  activityLevel: ActivityLevel;
  experienceLevel: ExperienceLevel;
  dietaryPreference?: string;
  medicalConditions?: string[];
}

export interface ProfileResponseDTO {
  id: string;
  userId: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  targetWeightKg?: number | null;
  fitnessGoal: FitnessGoal;
  activityLevel: ActivityLevel;
  experienceLevel: ExperienceLevel;
  dietaryPreference?: string | null;
  medicalConditions: string[];
  metrics: {
    bmi: number;
    bmr: number;
    tdee: number;
    targetCalories: number;
    macros: {
      proteinGrams: number;
      carbsGrams: number;
      fatGrams: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}
