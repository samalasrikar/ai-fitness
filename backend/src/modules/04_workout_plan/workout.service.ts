import { WorkoutRepository } from './workout.repository';
import {
  WorkoutPlan,
  WorkoutSession,
  WorkoutTemplate,
  LogSessionInput,
  CreateTemplateInput,
  AIGenerateWorkoutInput,
  ReplaceExerciseInput,
  WeeklyAnalytics,
  AIRecommendation,
} from './workout.types';
import { WorkoutGeneratorService } from './services/workout-generator.service';
import { ExerciseReplacementService } from './services/exercise-replacement.service';
import { WorkoutRecommendationService } from './services/workout-recommendation.service';
import { WorkoutAnalysisService } from './services/workout-analysis.service';
import { ApiError } from '../../utils/ApiError';

export class WorkoutService {
  private readonly repo = new WorkoutRepository();

  public async getActivePlan(userId: string): Promise<WorkoutPlan | null> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    return this.repo.getActivePlan(userId);
  }

  public async getDailyWorkout(userId: string, dayName?: string): Promise<WorkoutPlan> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    const active = await this.repo.getActivePlan(userId);
    
    // Day specific mappings
    const dayMap: Record<string, { title: string; muscleGroup: string; duration: string; calories: number }> = {
      Monday: { title: 'Chest & Triceps Hypertrophy', muscleGroup: 'Chest, Triceps', duration: '50 mins', calories: 420 },
      Tuesday: { title: 'Back & Biceps Power Pull', muscleGroup: 'Back, Biceps', duration: '55 mins', calories: 460 },
      Wednesday: { title: 'Active Recovery & Mobility', muscleGroup: 'Core, Mobility', duration: '30 mins', calories: 210 },
      Thursday: { title: 'Quads & Glutes Lower Body', muscleGroup: 'Quadriceps, Glutes', duration: '60 mins', calories: 510 },
      Friday: { title: 'Deltoids & Upper Body Pump', muscleGroup: 'Shoulders, Arms', duration: '45 mins', calories: 380 },
      Saturday: { title: 'Full Body Conditioning', muscleGroup: 'Full Body', duration: '55 mins', calories: 490 },
      Sunday: { title: 'Rest & Myofascial Release', muscleGroup: 'Rest Day', duration: '20 mins', calories: 120 },
    };

    const targetDay = dayName || 'Monday';
    const dayMeta = dayMap[targetDay] || dayMap['Monday'];

    if (active) {
      return {
        ...active,
        dayName: targetDay,
        title: `${targetDay}: ${active.title}`,
        muscleGroup: active.muscleGroup || dayMeta.muscleGroup,
      };
    }

    // Default generated fallback day plan if no active plan in DB
    const generated = await WorkoutGeneratorService.generateWorkout({
      goal: 'Hypertrophy',
      targetMuscle: dayMeta.muscleGroup,
      experience: 'Intermediate',
      workoutDuration: dayMeta.duration,
      equipment: ['Barbell', 'Dumbbell', 'Cable'],
    });

    return {
      ...generated,
      dayName: targetDay,
      title: dayMeta.title,
    };
  }

  public async generateAIWorkout(userId: string, input: AIGenerateWorkoutInput): Promise<WorkoutPlan> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    const plan = await WorkoutGeneratorService.generateWorkout(input);
    return this.repo.createPlan(userId, plan);
  }

  public async generatePlan(userId: string): Promise<WorkoutPlan> {
    return this.generateAIWorkout(userId, {
      goal: 'Hypertrophy',
      targetMuscle: 'Chest & Triceps',
      experience: 'Intermediate',
      workoutDuration: 50,
      equipment: ['Barbell', 'Dumbbell'],
    });
  }

  public async createManualPlan(userId: string, input: { title: string; duration: string; exercises: any[]; muscleGroup?: string }): Promise<WorkoutPlan> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    if (!input.title || input.title.trim() === '') {
      throw ApiError.badRequest('Workout title is required.');
    }
    if (!input.duration || input.duration.trim() === '') {
      throw ApiError.badRequest('Workout duration is required.');
    }
    if (!input.exercises || !Array.isArray(input.exercises) || input.exercises.length === 0) {
      throw ApiError.badRequest('At least one exercise is required.');
    }

    const validatedExercises = input.exercises.map((ex, idx) => {
      if (!ex.name || ex.name.trim() === '') {
        throw ApiError.badRequest(`Exercise name is required at position ${idx + 1}.`);
      }
      return {
        name: ex.name,
        sets: Number(ex.sets || 3),
        reps: String(ex.reps || '10'),
        weightKg: ex.weightKg !== undefined ? Number(ex.weightKg) : undefined,
        restTimeSec: ex.restTimeSec !== undefined ? Number(ex.restTimeSec) : 60,
        equipment: ex.equipment || 'Dumbbell',
        targetMuscle: ex.targetMuscle || input.muscleGroup || 'Full Body',
        rpe: ex.rpe !== undefined ? Number(ex.rpe) : 8.0,
        tempo: ex.tempo || '2-0-2',
        instructions: ex.instructions || '',
        tag: 'CUSTOM',
        tagColor: 'bg-amber-400 text-black',
        note: ex.note || ex.notes,
        imgSrc: ex.imgSrc || 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400',
      };
    });

    const plan: WorkoutPlan = {
      title: input.title,
      muscleGroup: input.muscleGroup || 'Full Body',
      duration: input.duration,
      estimatedCalories: Math.round(parseInt(input.duration, 10) * 8.5) || 350,
      exercises: validatedExercises,
    };
    return this.repo.createPlan(userId, plan);
  }

  public async resetPlan(userId: string): Promise<void> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    await this.repo.deactivatePlans(userId);
  }

  public async getAlternatives(input: ReplaceExerciseInput) {
    return ExerciseReplacementService.getAlternatives(input);
  }

  public async getWeeklyAnalytics(userId: string): Promise<WeeklyAnalytics> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    return WorkoutAnalysisService.getWeeklyAnalytics(userId);
  }

  public async getRecommendations(userId: string): Promise<AIRecommendation[]> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    return WorkoutRecommendationService.getRecommendations(userId);
  }

  // ── Sessions & History ──────────────────────────────────────────────────────
  public async logSession(userId: string, input: LogSessionInput): Promise<WorkoutSession> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    if (!input.title || input.title.trim() === '') {
      throw ApiError.badRequest('Session title is required.');
    }
    if (input.durationSeconds === undefined || input.durationSeconds === null) {
      throw ApiError.badRequest('Duration in seconds is required.');
    }
    return this.repo.createSession(userId, input);
  }

  public async getHistory(userId: string): Promise<WorkoutSession[]> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    return this.repo.getSessions(userId, 50);
  }

  public async getSessionDetails(userId: string, id: string): Promise<WorkoutSession | null> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    if (!id) throw ApiError.badRequest('Session ID is required.');
    return this.repo.getSessionById(userId, id);
  }

  public async deleteHistoryItem(userId: string, id: string): Promise<boolean> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    if (!id) throw ApiError.badRequest('Session ID is required.');
    return this.repo.deleteSession(userId, id);
  }

  // ── Templates ───────────────────────────────────────────────────────────────
  public async getTemplates(userId: string): Promise<WorkoutTemplate[]> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    return this.repo.getTemplates(userId);
  }

  public async createTemplate(userId: string, input: CreateTemplateInput): Promise<WorkoutTemplate> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    if (!input.title || input.title.trim() === '') {
      throw ApiError.badRequest('Template title is required.');
    }
    return this.repo.createTemplate(userId, input);
  }

  public async deleteTemplate(userId: string, id: string): Promise<boolean> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    if (!id) throw ApiError.badRequest('Template ID is required.');
    return this.repo.deleteTemplate(userId, id);
  }

  public async getHomeSummary(userId: string) {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    const history = await this.repo.getSessions(userId, 5);
    const activePlan = await this.getActivePlan(userId);

    const formattedRecent = history.map((s) => ({
      id: s.id,
      name: s.title,
      when: new Date(s.createdAt).toLocaleDateString() + ' • ' + Math.round(s.durationSeconds / 60) + ' min',
      kcal: s.caloriesBurned + ' kcal',
      bpm: '142 avg bpm',
      icon: s.title.toLowerCase().includes('push') ? 'fitness_center' : s.title.toLowerCase().includes('swim') ? 'pool' : 'sprint',
    }));

    return {
      readiness: 88,
      hrvMs: 82,
      weeklyGoal: { completed: Math.min(history.length, 4), total: 5 },
      recommendation: {
        title: 'Hypertrophy & Progressive Load',
        description: 'Optimal nervous system readiness. Focus on high mechanical tension.',
        time: activePlan?.duration ? activePlan.duration : '50m',
        intensity: '8.5/10',
        sets: activePlan?.exercises ? activePlan.exercises.length * 4 : 16,
      },
      recentWorkouts: formattedRecent,
    };
  }
}
