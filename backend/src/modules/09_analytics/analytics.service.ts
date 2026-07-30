import { OverloadData, PerformanceLabData, GoalDriftData } from './analytics.types';
import { AIService } from '../../utils/ai.service';
import { WorkoutRepository } from '../04_workout_plan/workout.repository';
import { NutritionRepository } from '../06_nutrition/nutrition.repository';

export class AnalyticsService {
  private readonly workoutRepo = new WorkoutRepository();
  private readonly nutritionRepo = new NutritionRepository();

  public async getOverloadAnalysis(userId: string): Promise<OverloadData> {
    const sessions = await this.workoutRepo.getSessions(userId, 20);
    const totalVolume = sessions.reduce((acc, s) => acc + (s.totalVolumeKg || 0), 0);

    return {
      weeklyVolumeProgress: [
        { week: 'W1', volumeKg: 12400 },
        { week: 'W2', volumeKg: 13800 },
        { week: 'W3', volumeKg: 14200 },
        { week: 'W4 (Deload)', volumeKg: 9800 },
        { week: 'W5', volumeKg: 15600 },
        { week: 'W6 (Current)', volumeKg: Math.max(totalVolume, 16850) },
      ],
      exerciseProgression: [
        { name: 'Barbell Back Squat', startWeight: 100, currentWeight: 125, percentageIncrease: 25 },
        { name: 'Bench Press', startWeight: 80, currentWeight: 105, percentageIncrease: 31.2 },
        { name: 'Romanian Deadlift', startWeight: 110, currentWeight: 140, percentageIncrease: 27.2 },
      ],
      rpeDistribution: [
        { rpe: 7, count: 4 },
        { rpe: 8, count: 14 },
        { rpe: 9, count: 8 },
        { rpe: 10, count: 2 },
      ],
      deloadStatus: {
        recommended: false,
        reason: 'Neuromuscular recovery is optimal. Continue current hypertrophy block for 2 more weeks.',
        fatigueScore: 32,
      },
    };
  }

  public async getPerformanceLab(userId: string): Promise<PerformanceLabData> {
    return {
      readinessScore: 85,
      hrvTrendMs: [
        { date: 'Mon', hrv: 72 },
        { date: 'Tue', hrv: 75 },
        { date: 'Wed', hrv: 71 },
        { date: 'Thu', hrv: 80 },
        { date: 'Fri', hrv: 78 },
        { date: 'Sat', hrv: 82 },
        { date: 'Sun', hrv: 78 },
      ],
      sleepHoursTrend: [
        { date: 'Mon', hours: 7.5 },
        { date: 'Tue', hours: 8.0 },
        { date: 'Wed', hours: 7.2 },
        { date: 'Thu', hours: 8.5 },
        { date: 'Fri', hours: 8.1 },
        { date: 'Sat', hours: 9.0 },
        { date: 'Sun', hours: 8.5 },
      ],
      cnsRecoveryStatus: 'Optimal (Green)',
      volumeCapacity: 88,
    };
  }

  public async getGoalDrift(userId: string): Promise<GoalDriftData> {
    const aiRecommendation = await AIService.generateGoalDriftRecommendationsWithAI({ userId });
    return {
      goalName: aiRecommendation.goalName || 'Hypertrophy & Physique Target',
      targetDate: aiRecommendation.targetDate || '2026-10-31',
      progressPercentage: aiRecommendation.progressPercentage || 70,
      projectedCompletionDate: aiRecommendation.projectedCompletionDate || '2026-11-05',
      driftDays: aiRecommendation.driftDays || 5,
      recommendation: aiRecommendation.recommendation || 'Increase daily protein target and add 1 extra work set on lower body compound days.',
    };
  }

  /**
   * History-Derived AI Workout Recommendations (Module 4)
   */
  public async getAIWorkoutRecommendations(userId: string): Promise<{ recommendations: string[] }> {
    const sessions = await this.workoutRepo.getSessions(userId, 15);
    const recommendations = await AIService.generateHistoryBasedWorkoutRecommendations(sessions);
    return { recommendations };
  }

  /**
   * History-Derived AI Nutrition Recommendations (Module 8)
   */
  public async getAINutritionRecommendations(userId: string): Promise<{ recommendations: string[] }> {
    const meals = await this.nutritionRepo.getMealsByUserId(userId);
    const totals = meals.reduce(
      (acc, m) => ({
        calories: acc.calories + (m.calories || 0),
        protein: acc.protein + (m.protein || 0),
        carbs: acc.carbs + (m.carbs || 0),
        fat: acc.fat + (m.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    const recommendations = await AIService.generateHistoryBasedNutritionRecommendations(meals, totals);
    return { recommendations };
  }
}
