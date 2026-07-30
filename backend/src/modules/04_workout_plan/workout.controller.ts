import { Response, NextFunction } from 'express';
import { WorkoutService } from './workout.service';
import { AuthenticatedRequest } from '../01_auth/auth.types';
import { ApiResponse } from '../../utils/ApiResponse';

export class WorkoutController {
  private readonly service = new WorkoutService();

  public getHomeSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const summary = await this.service.getHomeSummary(userId);
      res.status(200).json(ApiResponse.success('Home summary retrieved', summary));
    } catch (error) {
      next(error);
    }
  };

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

  public createManual = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const plan = await this.service.createManualPlan(userId, req.body);
      res.status(201).json(ApiResponse.created('Manual workout plan created', plan));
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

  // ── Session Operations ──────────────────────────────────────────────────────
  public logSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const session = await this.service.logSession(userId, req.body);
      res.status(201).json(ApiResponse.created('Workout session logged successfully', session));
    } catch (error) {
      next(error);
    }
  };

  public getHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const history = await this.service.getHistory(userId);
      res.status(200).json(ApiResponse.success('Workout history retrieved', history));
    } catch (error) {
      next(error);
    }
  };

  public getSessionById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const session = await this.service.getSessionDetails(userId, id);
      if (!session) {
        res.status(404).json(ApiResponse.error('Session not found', 404));
        return;
      }
      res.status(200).json(ApiResponse.success('Session details retrieved', session));
    } catch (error) {
      next(error);
    }
  };

  public deleteHistoryItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.service.deleteHistoryItem(userId, id);
      res.status(200).json(ApiResponse.success('Workout history item deleted'));
    } catch (error) {
      next(error);
    }
  };

  // ── Vault Templates Operations ─────────────────────────────────────────────
  public getTemplates = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const templates = await this.service.getTemplates(userId);
      res.status(200).json(ApiResponse.success('Workout templates retrieved', templates));
    } catch (error) {
      next(error);
    }
  };

  public createTemplate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const template = await this.service.createTemplate(userId, req.body);
      res.status(201).json(ApiResponse.created('Workout template created', template));
    } catch (error) {
      next(error);
    }
  };

  public deleteTemplate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.service.deleteTemplate(userId, id);
      res.status(200).json(ApiResponse.success('Workout template deleted'));
    } catch (error) {
      next(error);
    }
  };
}
