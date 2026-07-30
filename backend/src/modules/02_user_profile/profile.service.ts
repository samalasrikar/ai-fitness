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

export class ProfileService {
  private readonly repository: ProfileRepository;

  constructor(repository: ProfileRepository = new ProfileRepository()) {
    this.repository = repository;
  }

  /**
   * Retrieves profile for a user by ID (or returns default object if not created yet)
   */
  public async getProfileByUserId(userId: string): Promise<ProfileResponseDTO> {
    const profile = await this.repository.findByUserId(userId);
    if (!profile) {
      // Return a default profile fallback instead of 404 error
      return {
        id: userId,
        userId,
        age: 26,
        gender: 'MALE',
        heightCm: 178,
        weightKg: 74,
        targetWeightKg: 70,
        fitnessGoal: 'MUSCLE_GAIN',
        activityLevel: 'MODERATELY_ACTIVE',
        experienceLevel: 'INTERMEDIATE',
        dietaryPreference: 'HIGH_PROTEIN',
        medicalConditions: [],
        metrics: {
          bmi: 23.4,
          bmr: 1750,
          tdee: 2450,
          targetCalories: 2600,
          macros: { proteinGrams: 160, carbsGrams: 280, fatGrams: 65 },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return this.mapToProfileResponseDTO(profile);
  }

  /**
   * Upserts profile and recalculates all health metrics
   */
  public async upsertProfile(userId: string, rawDto: any): Promise<ProfileResponseDTO> {
    const existing = await this.repository.findByUserId(userId);

    // Compute height in cm from heightFt / heightIn if passed
    let computedHeightCm = rawDto.heightCm;
    if (!computedHeightCm && (rawDto.heightFt || rawDto.heightIn)) {
      const ft = Number(rawDto.heightFt) || 5;
      const inch = Number(rawDto.heightIn) || 10;
      computedHeightCm = Math.round((ft * 30.48) + (inch * 2.54));
    }

    const weightKg = Number(rawDto.weightKg || rawDto.weight || existing?.weight_kg || 74);
    const heightCm = Number(computedHeightCm || existing?.height_cm || 178);
    const age = Number(rawDto.age || existing?.age || 26);
    const gender = (rawDto.gender || existing?.gender || 'MALE') as Gender;
    const fitnessGoal = (rawDto.fitnessGoal || existing?.fitness_goal || 'MUSCLE_GAIN') as FitnessGoal;
    const activityLevel = (rawDto.activityLevel || existing?.activity_level || 'MODERATELY_ACTIVE') as ActivityLevel;

    const dto: UpsertProfileDTO = {
      age,
      gender,
      heightCm,
      weightKg,
      targetWeightKg: Number(rawDto.targetWeightKg || existing?.target_weight_kg || 70),
      fitnessGoal,
      activityLevel,
      experienceLevel: rawDto.experienceLevel || rawDto.fitnessLevel || existing?.experience_level || 'INTERMEDIATE',
      dietaryPreference: rawDto.dietaryPreference || existing?.dietary_preference || 'HIGH_PROTEIN',
      medicalConditions: rawDto.medicalConditions || existing?.medical_conditions || [],
    };

    // 1. Calculate BMR (Mifflin-St Jeor Equation)
    const bmr = this.calculateBMR(weightKg, heightCm, age, gender);

    // 2. Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = this.calculateTDEE(bmr, activityLevel);

    // 3. Calculate Target Calories based on Goal
    const targetCalories = this.calculateTargetCalories(tdee, fitnessGoal);

    // 4. Calculate Macronutrients (Protein, Carbs, Fat)
    const macros = this.calculateMacros(weightKg, targetCalories, fitnessGoal);

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

  private calculateBMR(weightKg: number, heightCm: number, age: number, gender: Gender): number {
    const baseBMR = 10 * weightKg + 6.25 * heightCm - 5 * age;
    if (gender === 'MALE') {
      return baseBMR + 5;
    } else if (gender === 'FEMALE') {
      return baseBMR - 161;
    }
    return baseBMR - 78;
  }

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

  private calculateTargetCalories(tdee: number, goal: FitnessGoal): number {
    switch (goal) {
      case 'WEIGHT_LOSS':
        return Math.max(tdee - 500, 1200);
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

  private calculateMacros(
    weightKg: number,
    targetCalories: number,
    goal: FitnessGoal,
  ): { proteinGrams: number; carbsGrams: number; fatGrams: number } {
    const proteinFactor = goal === 'MUSCLE_GAIN' || goal === 'WEIGHT_LOSS' ? 2.2 : 1.8;
    const proteinGrams = weightKg * proteinFactor;
    const proteinCalories = proteinGrams * 4;

    const fatCalories = targetCalories * 0.25;
    const fatGrams = fatCalories / 9;

    const remainingCalories = Math.max(targetCalories - (proteinCalories + fatCalories), 0);
    const carbsGrams = remainingCalories / 4;

    return { proteinGrams, carbsGrams, fatGrams };
  }

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
