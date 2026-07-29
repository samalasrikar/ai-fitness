import { ProfileRepository } from './profile.repository';
import {
  UpsertProfileDTO,
  ProfileResponseDTO,
  UserProfileEntity,
  Gender,
  ActivityLevel,
  FitnessGoal,
} from './profile.types';
import { ApiError } from '../../utils/ApiError';

// ─────────────────────────────────────────────────────────────────────────────
// User Profile Service – Science-Backed Fitness Engine & Health Calculations
// Implements Mifflin-St Jeor BMR, TDEE, & Macro distribution algorithms
// ─────────────────────────────────────────────────────────────────────────────

export class ProfileService {
  private readonly repository: ProfileRepository;

  constructor(repository: ProfileRepository = new ProfileRepository()) {
    this.repository = repository;
  }

  /**
   * Retrieves profile for a user by ID
   */
  public async getProfileByUserId(userId: string): Promise<ProfileResponseDTO> {
    const profile = await this.repository.findByUserId(userId);
    if (!profile) {
      throw ApiError.notFound('User profile not found. Please complete profile setup.');
    }
    return this.mapToProfileResponseDTO(profile);
  }

  /**
   * Upserts profile and recalculates all health metrics
   */
  public async upsertProfile(userId: string, dto: UpsertProfileDTO): Promise<ProfileResponseDTO> {
    // 1. Calculate BMR (Mifflin-St Jeor Equation)
    const bmr = this.calculateBMR(dto.weightKg, dto.heightCm, dto.age, dto.gender);

    // 2. Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = this.calculateTDEE(bmr, dto.activityLevel);

    // 3. Calculate Target Calories based on Goal
    const targetCalories = this.calculateTargetCalories(tdee, dto.fitnessGoal);

    // 4. Calculate Macronutrients (Protein, Carbs, Fat)
    const macros = this.calculateMacros(dto.weightKg, targetCalories, dto.fitnessGoal);

    const calculatedMetrics = {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      proteinGrams: Math.round(macros.proteinGrams),
      carbsGrams: Math.round(macros.carbsGrams),
      fatGrams: Math.round(macros.fatGrams),
    };

    const updatedProfile = await this.repository.upsertProfile(userId, dto, calculatedMetrics);
    return this.mapToProfileResponseDTO(updatedProfile);
  }

  /**
   * Calculates Basal Metabolic Rate using Mifflin-St Jeor Equation
   */
  private calculateBMR(weightKg: number, heightCm: number, age: number, gender: Gender): number {
    const baseBMR = 10 * weightKg + 6.25 * heightCm - 5 * age;
    if (gender === 'MALE') {
      return baseBMR + 5;
    } else if (gender === 'FEMALE') {
      return baseBMR - 161;
    }
    return baseBMR - 78; // Median fallback for OTHER / PREFER_NOT_TO_SAY
  }

  /**
   * Calculates Total Daily Energy Expenditure (TDEE) based on activity level
   */
  private calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    const multipliers: Record<ActivityLevel, number> = {
      SEDENTARY: 1.2,
      LIGHTLY_ACTIVE: 1.375,
      MODERATELY_ACTIVE: 1.55,
      VERY_ACTIVE: 1.725,
      EXTRA_ACTIVE: 1.9,
    };
    return bmr * (multipliers[activityLevel] || 1.2);
  }

  /**
   * Calculates Target Daily Caloric Intake based on primary fitness goal
   */
  private calculateTargetCalories(tdee: number, goal: FitnessGoal): number {
    switch (goal) {
      case 'WEIGHT_LOSS':
        return Math.max(tdee - 500, 1200); // Safe minimum floor
      case 'MUSCLE_GAIN':
        return tdee + 350;
      case 'STRENGTH':
      case 'ENDURANCE':
        return tdee + 150;
      case 'MAINTENANCE':
      default:
        return tdee;
    }
  }

  /**
   * Calculates Macronutrient distribution (Protein, Carbs, Fat)
   */
  private calculateMacros(
    weightKg: number,
    targetCalories: number,
    goal: FitnessGoal,
  ): { proteinGrams: number; carbsGrams: number; fatGrams: number } {
    // Protein target: 2.0g per kg for muscle gain/loss, 1.8g for maintenance
    const proteinFactor = goal === 'MUSCLE_GAIN' || goal === 'WEIGHT_LOSS' ? 2.2 : 1.8;
    const proteinGrams = weightKg * proteinFactor;
    const proteinCalories = proteinGrams * 4;

    // Fat target: 25% of total daily calories
    const fatCalories = targetCalories * 0.25;
    const fatGrams = fatCalories / 9;

    // Carbohydrates: Remaining caloric budget
    const remainingCalories = Math.max(targetCalories - (proteinCalories + fatCalories), 0);
    const carbsGrams = remainingCalories / 4;

    return { proteinGrams, carbsGrams, fatGrams };
  }

  /**
   * Maps database profile entity to response DTO
   */
  private mapToProfileResponseDTO(entity: UserProfileEntity): ProfileResponseDTO {
    const heightMeters = Number(entity.height_cm) / 100;
    const weightKg = Number(entity.weight_kg);
    const bmi = Number((weightKg / (heightMeters * heightMeters)).toFixed(1));

    return {
      id: entity.id,
      userId: entity.user_id,
      age: entity.age,
      gender: entity.gender,
      heightCm: Number(entity.height_cm),
      weightKg: Number(entity.weight_kg),
      targetWeightKg: entity.target_weight_kg ? Number(entity.target_weight_kg) : null,
      fitnessGoal: entity.fitness_goal,
      activityLevel: entity.activity_level,
      experienceLevel: entity.experience_level,
      dietaryPreference: entity.dietary_preference,
      medicalConditions: entity.medical_conditions || [],
      metrics: {
        bmi,
        bmr: Number(entity.bmr) || 0,
        tdee: Number(entity.tdee) || 0,
        targetCalories: Number(entity.target_calories) || 0,
        macros: {
          proteinGrams: Number(entity.target_protein_g) || 0,
          carbsGrams: Number(entity.target_carbs_g) || 0,
          fatGrams: Number(entity.target_fat_g) || 0,
        },
      },
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
    };
  }
}
