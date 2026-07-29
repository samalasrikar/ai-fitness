import { Response, NextFunction } from 'express';
import { ProfileService } from './profile.service';
import { AuthenticatedRequest, UpsertProfileDTO } from './profile.types';
import { ApiResponse } from '../../utils/ApiResponse';

// ─────────────────────────────────────────────────────────────────────────────
// User Profile Controller – HTTP Endpoint Handler
// ─────────────────────────────────────────────────────────────────────────────

export class ProfileController {
  private readonly profileService: ProfileService;

  constructor(profileService: ProfileService = new ProfileService()) {
    this.profileService = profileService;
  }

  /**
   * GET /api/v1/profile/me
   */
  public getMyProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const profile = await this.profileService.getProfileByUserId(userId);
      res.status(200).json(ApiResponse.success('User profile retrieved successfully', profile));
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/profile/me
   */
  public updateMyProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const dto: UpsertProfileDTO = req.body;
      const updatedProfile = await this.profileService.upsertProfile(userId, dto);
      res
        .status(200)
        .json(ApiResponse.success('User profile updated successfully', updatedProfile));
    } catch (error) {
      next(error);
    }
  };
}
