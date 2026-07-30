import { Request, Response, NextFunction } from 'express';
import { ExerciseService } from './exercise.service';
import { ApiResponse } from '../../utils/ApiResponse';

export class ExerciseController {
  private readonly service = new ExerciseService();

  public getExercises = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const category = typeof req.query.category === 'string' ? req.query.category : undefined;
      const exercises = await this.service.getExercises(search, category);
      res.status(200).json(ApiResponse.success('Exercises retrieved', exercises));
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const exercise = await this.service.getExerciseById(id);
      if (!exercise) {
        res.status(404).json(ApiResponse.error('Exercise not found', 404));
        return;
      }
      res.status(200).json(ApiResponse.success('Exercise intel retrieved', exercise));
    } catch (error) {
      next(error);
    }
  };

  public getAlternatives = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const exerciseName = typeof req.query.exerciseName === 'string' ? req.query.exerciseName : undefined;
      const alternatives = await this.service.getAlternatives(exerciseName);
      res.status(200).json(ApiResponse.success('Smart alternatives retrieved', alternatives));
    } catch (error) {
      next(error);
    }
  };
}
