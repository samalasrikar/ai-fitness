import { WorkoutRepository } from './workout.repository';
import { WorkoutPlan, WorkoutSession, WorkoutTemplate, LogSessionInput, CreateTemplateInput } from './workout.types';
import { AIService } from '../../utils/ai.service';
import { ApiError } from '../../utils/ApiError';

export class WorkoutService {
  private readonly repo = new WorkoutRepository();

  public async getActivePlan(userId: string): Promise<WorkoutPlan> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    const existing = await this.repo.getActivePlan(userId);
    if (existing) return existing;
    return this.generatePlan(userId);
  }

  public async generatePlan(userId: string): Promise<WorkoutPlan> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    const aiPlan = await AIService.generateWorkoutPlanWithAI({
      focusArea: 'Hypertrophy Push & Core',
      targetDuration: 60,
    });

    const generated: WorkoutPlan = {
      title: aiPlan.title ? aiPlan.title : 'Hypertrophy Push A',
      duration: aiPlan.duration ? aiPlan.duration : '60 mins',
      exercises: (aiPlan.exercises ? aiPlan.exercises : []).map((ex) => ({
        name: ex.name,
        sets: ex.sets ? ex.sets : 4,
        reps: String(ex.reps ? ex.reps : '8-10'),
        rpe: ex.rpe ? ex.rpe : 8.5,
        tag: ex.tag ? ex.tag : 'AI OPTIMIZED',
        tagColor: ex.tagColor ? ex.tagColor : 'bg-[#f5c400] text-black',
        note: ex.note,
        extra: ex.extra,
        imgAlt: ex.imgAlt ? ex.imgAlt : ex.name,
        imgSrc: ex.imgSrc ? ex.imgSrc : 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400',
      })),
    };
    return this.repo.createPlan(userId, generated);
  }

  public async createManualPlan(userId: string, input: { title: string; duration: string; exercises: any[] }): Promise<WorkoutPlan> {
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
      if (ex.sets === undefined || ex.sets === null || isNaN(Number(ex.sets))) {
        throw ApiError.badRequest(`Sets value is required for exercise "${ex.name}".`);
      }
      if (ex.reps === undefined || ex.reps === null || String(ex.reps).trim() === '') {
        throw ApiError.badRequest(`Reps value is required for exercise "${ex.name}".`);
      }
      return {
        name: ex.name,
        sets: Number(ex.sets),
        reps: String(ex.reps),
        weightKg: ex.weightKg !== undefined && ex.weightKg !== null ? Number(ex.weightKg) : undefined,
        rpe: ex.rpe !== undefined && ex.rpe !== null ? Number(ex.rpe) : 8.0,
        tag: 'CUSTOM',
        tagColor: 'bg-[#ffba38] text-black',
        note: ex.note ? ex.note : ex.notes,
        extra: ex.extra ? ex.extra : (ex.restTimeSec ? `REST: ${ex.restTimeSec}s` : undefined),
        imgAlt: ex.name,
        imgSrc: ex.imgSrc ? ex.imgSrc : 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400',
      };
    });

    const plan: WorkoutPlan = {
      title: input.title,
      duration: input.duration,
      exercises: validatedExercises,
    };
    return this.repo.createPlan(userId, plan);
  }

  public async resetPlan(userId: string): Promise<void> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    await this.repo.deactivatePlans(userId);
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

  // ── Home Dashboard Summary ──────────────────────────────────────────────────
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
      readiness: 85,
      hrvMs: 78,
      weeklyGoal: { completed: Math.min(history.length, 4), total: 5 },
      recommendation: {
        title: 'High Performance: Hypertrophy Focus',
        description: 'Based on elevated HRV and optimal sleep, posterior chain recruitment is recommended today.',
        time: activePlan.duration ? activePlan.duration : '60m',
        intensity: '8/10',
        sets: activePlan.exercises.length * 4,
      },
      recentWorkouts: formattedRecent,
    };
  }
}
