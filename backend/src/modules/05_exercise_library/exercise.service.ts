import { ExerciseRepository } from './exercise.repository';
import { Exercise, ExerciseAlternative } from './exercise.types';

export class ExerciseService {
  private readonly repo = new ExerciseRepository();

  public async getExercises(search?: string, category?: string): Promise<Exercise[]> {
    return this.repo.getExercises(search, category);
  }

  public async getExerciseById(id: string): Promise<Exercise | null> {
    return this.repo.getExerciseById(id);
  }

  public async getAlternatives(exerciseName?: string): Promise<ExerciseAlternative[]> {
    return this.repo.getAlternatives(exerciseName);
  }
}
