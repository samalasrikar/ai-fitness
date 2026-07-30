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
      res.status(200).json(ApiResponse.success('Progress dashboard metrics retrieved', metrics));
    } catch (error) {
      next(error);
    }
  };

  public toggleChallenge = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const joined = await this.service.toggleChallenge(userId);
      res.status(200).json(ApiResponse.success('Challenge status toggled', { hasJoinedChallenge: joined }));
    } catch (error) {
      next(error);
    }
  };
}
