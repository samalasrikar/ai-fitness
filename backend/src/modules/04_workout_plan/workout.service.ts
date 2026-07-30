import { WorkoutRepository } from './workout.repository';
import { WorkoutPlan } from './workout.types';

export class WorkoutService {
  private readonly repo = new WorkoutRepository();

  public async getActivePlan(userId: string): Promise<WorkoutPlan | null> {
    return this.repo.getActivePlan(userId);
  }

  public async generatePlan(userId: string): Promise<WorkoutPlan> {
    const generated: WorkoutPlan = {
      title: 'Hypertrophy Push A',
      duration: '45 mins',
      exercises: [
        { name: 'Incline Dumbbell Press', sets: '4x8-10 reps', rpe: 'RPE 8.5' },
        { name: 'Overhead Barbell Press', sets: '3x6-8 reps', rpe: 'RPE 8' },
        { name: 'Weighted Chest Dips', sets: '3x10 reps', rpe: 'RPE 9' },
        { name: 'Cable Lateral Raises', sets: '4x12-15 reps', rpe: 'RPE 9' },
        { name: 'Triceps Overhead Extensions', sets: '3x10-12 reps', rpe: 'RPE 8.5' }
      ]
    };
    return this.repo.createPlan(userId, generated);
  }

  public async resetPlan(userId: string): Promise<void> {
    await this.repo.deactivatePlans(userId);
  }
}
