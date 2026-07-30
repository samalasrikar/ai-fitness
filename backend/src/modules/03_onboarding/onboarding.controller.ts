import { Response, NextFunction } from 'express';
import { OnboardingService } from './onboarding.service';
import { AuthenticatedRequest } from '../01_auth/auth.types';
import { ApiResponse } from '../../utils/ApiResponse';

export class OnboardingController {
  private readonly service = new OnboardingService();

  public save = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const record = await this.service.saveOnboarding(userId, req.body);
      res.status(200).json(ApiResponse.success('Onboarding protocol saved successfully', record));
    } catch (error) {
      next(error);
    }
  };

  public getStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const record = await this.service.getOnboardingStatus(userId);
      res.status(200).json(ApiResponse.success('Onboarding status retrieved', record));
    } catch (error) {
      next(error);
    }
  };
}
