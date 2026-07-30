import { Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import { AuthenticatedRequest } from '../01_auth/auth.types';
import { ApiResponse } from '../../utils/ApiResponse';

export class AnalyticsController {
  private readonly service = new AnalyticsService();

  public getOverload = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const data = await this.service.getOverloadAnalysis(userId);
      res.status(200).json(ApiResponse.success('Overload analysis retrieved', data));
    } catch (error) {
      next(error);
    }
  };

  public getPerformanceLab = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const data = await this.service.getPerformanceLab(userId);
      res.status(200).json(ApiResponse.success('Performance lab biometrics retrieved', data));
    } catch (error) {
      next(error);
    }
  };

  public getGoalDrift = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const data = await this.service.getGoalDrift(userId);
      res.status(200).json(ApiResponse.success('Goal drift analysis retrieved', data));
    } catch (error) {
      next(error);
    }
  };

  public getWorkoutRecommendations = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const data = await this.service.getAIWorkoutRecommendations(userId);
      res.status(200).json(ApiResponse.success('AI Workout recommendations retrieved', data));
    } catch (error) {
      next(error);
    }
  };

  public getNutritionRecommendations = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const data = await this.service.getAINutritionRecommendations(userId);
      res.status(200).json(ApiResponse.success('AI Nutrition recommendations retrieved', data));
    } catch (error) {
      next(error);
    }
  };
}
