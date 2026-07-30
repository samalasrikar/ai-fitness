import { Response, NextFunction } from 'express';
import { NutritionService } from './nutrition.service';
import { AuthenticatedRequest } from '../01_auth/auth.types';
import { ApiResponse } from '../../utils/ApiResponse';

export class NutritionController {
  private readonly service = new NutritionService();

  public getSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const summary = await this.service.getSummary(userId);
      res.status(200).json(ApiResponse.success('Nutrition summary retrieved', summary));
    } catch (error) {
      next(error);
    }
  };

  public getLoggedMeals = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const meals = await this.service.getLoggedMeals(userId);
      res.status(200).json(ApiResponse.success('Logged meals retrieved', meals));
    } catch (error) {
      next(error);
    }
  };

  public analyzeMeal = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const mealInput = req.body.description || req.body.mealText || '';
      const analysis = await this.service.analyzeMeal(mealInput);
      res.status(200).json(ApiResponse.success('Meal analyzed', analysis));
    } catch (error) {
      next(error);
    }
  };

  public getRecommendations = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const recommendations = await this.service.getRecommendations(req.body);
      res.status(200).json(ApiResponse.success('Nutrition recommendations retrieved', recommendations));
    } catch (error) {
      next(error);
    }
  };

  public generateMealPlan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const plan = await this.service.generateMealPlan(req.body);
      res.status(201).json(ApiResponse.created('AI Meal Plan generated', plan));
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

  public duplicateMeal = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const meal = await this.service.duplicateMeal(userId, id);
      res.status(201).json(ApiResponse.created('Meal duplicated successfully', meal));
    } catch (error) {
      next(error);
    }
  };

  public deleteMeal = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.service.deleteMeal(userId, id);
      res.status(200).json(ApiResponse.success('Meal log deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}
