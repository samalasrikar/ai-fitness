import { Response, NextFunction } from 'express';
import { ProgressService } from './progress.service';
import { AuthenticatedRequest } from '../01_auth/auth.types';
import { ApiResponse } from '../../utils/ApiResponse';

export class ProgressController {
  private readonly service = new ProgressService();

  public getMetrics = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const metrics = await this.service.getDashboardMetrics(userId);
      res.status(200).json(ApiResponse.success('Dashboard metrics retrieved', metrics));
    } catch (error) {
      next(error);
    }
  };

  public getDashboardSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const summary = await this.service.getDashboardSummary(userId);
      res.status(200).json(ApiResponse.success('Dashboard summary retrieved', summary));
    } catch (error) {
      next(error);
    }
  };

  public toggleChallenge = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const result = await this.service.toggleChallenge(userId);
      res.status(200).json(ApiResponse.success('Challenge status updated', result));
    } catch (error) {
      next(error);
    }
  };

  public getPersonalRecords = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const records = await this.service.getPersonalRecords(userId);
      res.status(200).json(ApiResponse.success('Personal records retrieved', records));
    } catch (error) {
      next(error);
    }
  };

  public getRecordsSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const summary = await this.service.getRecordsSummary(userId);
      res.status(200).json(ApiResponse.success('Records summary retrieved', summary));
    } catch (error) {
      next(error);
    }
  };

  public createPersonalRecord = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const record = await this.service.createPersonalRecord(userId, req.body);
      res.status(201).json(ApiResponse.created('Personal record created', record));
    } catch (error) {
      next(error);
    }
  };

  public deletePersonalRecord = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.service.deletePersonalRecord(userId, id);
      res.status(200).json(ApiResponse.success('Personal record deleted'));
    } catch (error) {
      next(error);
    }
  };
}
