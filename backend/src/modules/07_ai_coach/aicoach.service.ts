import { AICoachRepository } from './aicoach.repository';
import { ChatMessage } from './aicoach.types';
import { WorkoutRepository } from '../04_workout_plan/workout.repository';
import { AIService } from '../../utils/ai.service';
import { ApiError } from '../../utils/ApiError';

export class AICoachService {
  private readonly repo = new AICoachRepository();
  private readonly workoutRepo = new WorkoutRepository();

  public async getHistory(userId: string): Promise<ChatMessage[]> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    return this.repo.getHistory(userId);
  }

  public async sendMessage(userId: string, userText: string): Promise<ChatMessage> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    if (!userText || userText.trim() === '') {
      throw ApiError.badRequest('Message content is required.');
    }
    const history = await this.repo.getHistory(userId);
    await this.repo.saveMessage(userId, 'user', userText);
    const coachReply = await AIService.generateCoachReply(userText, history);
    return this.repo.saveMessage(userId, 'coach', coachReply);
  }

  public async generateAIWorkout(userId: string, input: { focusArea?: string; targetDuration?: number; energyLevel?: number; equipment?: string[] }) {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    const aiPlan = await AIService.generateWorkoutPlanWithAI(input);
    const generated = await this.workoutRepo.createPlan(userId, {
      title: aiPlan.title,
      duration: aiPlan.duration,
      exercises: aiPlan.exercises.map((ex) => ({
        name: ex.name,
        sets: ex.sets ? ex.sets : 3,
        reps: String(ex.reps ? ex.reps : '10'),
        rpe: ex.rpe ? ex.rpe : 8,
        tag: ex.tag ? ex.tag : 'AI OPTIMIZED',
        tagColor: ex.tagColor ? ex.tagColor : 'bg-[#f5c400] text-black',
        note: ex.note,
        extra: ex.extra,
        imgAlt: ex.imgAlt ? ex.imgAlt : ex.name,
        imgSrc: ex.imgSrc ? ex.imgSrc : 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400',
      })),
    });
    return generated;
  }

  public async getInjuryGuard(userId: string) {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    const logs = await this.repo.getInjuryLogs(userId);
    if (logs.length === 0) {
      return {
        status: 'OPTIMAL',
        activeAlerts: [],
        history: [],
      };
    }

    return {
      status: 'PROTECTIVE_MODE',
      activeAlerts: logs.map((l) => ({
        id: l.id,
        bodyPart: l.bodyPart,
        severity: l.discomfortLevel,
        recommendation: `Reduce load by ${l.discomfortLevel * 5}% on ${l.bodyPart} movement patterns.`,
      })),
      history: logs,
    };
  }

  public async logInjury(userId: string, data: { bodyPart: string; discomfortLevel: number; notes?: string }) {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    if (!data.bodyPart || data.bodyPart.trim() === '') {
      throw ApiError.badRequest('Body part is required.');
    }
    if (data.discomfortLevel === undefined || data.discomfortLevel === null || isNaN(Number(data.discomfortLevel))) {
      throw ApiError.badRequest('Discomfort level is required.');
    }
    return this.repo.createInjuryLog(userId, data);
  }

  public async getExerciseAnalysis(exerciseId?: string) {
    if (!exerciseId || exerciseId.trim() === '') {
      throw ApiError.badRequest('Exercise name or ID is required.');
    }
    const exerciseName = exerciseId.replace(/-/g, ' ');
    return AIService.generateExerciseAnalysisWithAI(exerciseName);
  }
}
