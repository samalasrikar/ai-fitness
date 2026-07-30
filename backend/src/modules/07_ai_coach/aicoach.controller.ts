import { Response, NextFunction } from 'express';
import { AICoachService } from './aicoach.service';
import { AuthenticatedRequest } from '../01_auth/auth.types';
import { ApiResponse } from '../../utils/ApiResponse';

export class AICoachController {
  private readonly service = new AICoachService();

  public getHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const history = await this.service.getHistory(userId);
      res.status(200).json(ApiResponse.success('Chat history retrieved', history));
    } catch (error) {
      next(error);
    }
  };

  public chat = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { text } = req.body;
      const reply = await this.service.sendMessage(userId, text || '');
      res.status(200).json(ApiResponse.success('Coach replied', reply));
    } catch (error) {
      next(error);
    }
  };

  public generateWorkout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const plan = await this.service.generateAIWorkout(userId, req.body);
      res.status(201).json(ApiResponse.created('AI workout plan generated', plan));
    } catch (error) {
      next(error);
    }
  };

  public getInjuryGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const status = await this.service.getInjuryGuard(userId);
      res.status(200).json(ApiResponse.success('Injury guard status retrieved', status));
    } catch (error) {
      next(error);
    }
  };

  public logInjury = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const log = await this.service.logInjury(userId, req.body);
      res.status(201).json(ApiResponse.created('Injury log saved', log));
    } catch (error) {
      next(error);
    }
  };

  public getExerciseAnalysis = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const analysis = await this.service.getExerciseAnalysis(req.query.exerciseId as string);
      res.status(200).json(ApiResponse.success('Exercise analysis retrieved', analysis));
    } catch (error) {
      next(error);
    }
  };
}
