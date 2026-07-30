import { Response, NextFunction } from 'express';
import { WorkoutService } from './workout.service';
import { AuthenticatedRequest } from '../01_auth/auth.types';
import { ApiResponse } from '../../utils/ApiResponse';

export class WorkoutController {
  private readonly service = new WorkoutService();

  public getActive = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const plan = await this.service.getActivePlan(userId);
      res.status(200).json(ApiResponse.success('Active workout plan retrieved', plan));
    } catch (error) {
      next(error);
    }
  };

  public generate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const plan = await this.service.generatePlan(userId);
      res.status(201).json(ApiResponse.created('Workout plan generated', plan));
    } catch (error) {
      next(error);
    }
  };

  public reset = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      await this.service.resetPlan(userId);
      res.status(200).json(ApiResponse.success('Active workout plan reset'));
    } catch (error) {
      next(error);
    }
  };
}
