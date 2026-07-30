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
}
