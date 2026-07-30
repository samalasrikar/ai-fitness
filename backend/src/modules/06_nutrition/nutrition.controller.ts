import { Response, NextFunction } from 'express';
import { NutritionService } from './nutrition.service';
import { AuthenticatedRequest } from '../01_auth/auth.types';
import { ApiResponse } from '../../utils/ApiResponse';

export class NutritionController {
  private readonly service = new NutritionService();

  public getMeals = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const meals = await this.service.getLoggedMeals(userId);
      res.status(200).json(ApiResponse.success('Logged meals retrieved', meals));
    } catch (error) {
      next(error);
    }
  };

  public analyze = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { mealText } = req.body;
      const result = await this.service.analyzeMeal(mealText || '');
      res.status(200).json(ApiResponse.success('Meal analyzed successfully', result));
    } catch (error) {
      next(error);
    }
  };

  public logMeal = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const meal = await this.service.logMeal(userId, req.body);
      res.status(201).json(ApiResponse.created('Meal logged successfully', meal));
    } catch (error) {
      next(error);
    }
  };
}
