import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedRequest, RegisterDTO, LoginDTO } from './auth.types';
import { ApiResponse } from '../../utils/ApiResponse';
import { env } from '../../env';
import { logAuthEvent } from '../../utils/authLogger';

// ─────────────────────────────────────────────────────────────────────────────
// Auth Controller – HTTP Layer
// Handles HTTP requests, manages secure HTTP-only cookies, and returns DTOs
// ─────────────────────────────────────────────────────────────────────────────

export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService = new AuthService()) {
    this.authService = authService;
  }

  /**
   * POST /api/v1/auth/register
   */
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: RegisterDTO = req.body;
      const result = await this.authService.register(dto);

      this.setRefreshTokenCookie(res, result.tokens.refreshToken);
      logAuthEvent(req, 'auth.signup', result.user.id);

      res.status(201).json(
        ApiResponse.created('Account created successfully', {
          user: result.user,
          accessToken: result.tokens.accessToken,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/login
   */
  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: LoginDTO = req.body;
      const result = await this.authService.login(dto);

      this.setRefreshTokenCookie(res, result.tokens.refreshToken);
      logAuthEvent(req, 'auth.login', result.user.id);

      res.status(200).json(
        ApiResponse.success('Logged in successfully', {
          user: result.user,
          accessToken: result.tokens.accessToken,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/refresh
   */
  public refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      const tokens = await this.authService.refreshToken(refreshToken);

      this.setRefreshTokenCookie(res, tokens.refreshToken);
      logAuthEvent(req, 'auth.refresh');

      res.status(200).json(
        ApiResponse.success('Token refreshed successfully', {
          accessToken: tokens.accessToken,
        }),
      );
    } catch (error: any) {
      if (error?.message?.includes('reuse')) {
        logAuthEvent(req, 'auth.tokenReuseDetected');
      } else {
        logAuthEvent(req, 'auth.refreshFailed');
      }
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/logout
   */
  public logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (userId) {
        await this.authService.logout(userId);
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: env.IS_PRODUCTION,
        sameSite: 'lax',
      });

      logAuthEvent(req, 'auth.logout', userId);
      res.status(200).json(ApiResponse.success('Logged out successfully'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/auth/me
   */
  public getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const user = await this.authService.getCurrentUser(userId);

      res.status(200).json(ApiResponse.success('Current user retrieved successfully', user));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Configures HTTP-only secure cookie for refresh tokens
   */
  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.IS_PRODUCTION,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
