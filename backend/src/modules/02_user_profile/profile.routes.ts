import { Router } from 'express';
import { ProfileController } from './profile.controller';
import { upsertProfileValidation, validateRequest } from './profile.validation';
import { authenticateToken } from '../01_auth/auth.middleware';

// ─────────────────────────────────────────────────────────────────────────────
// User Profile Router
// ─────────────────────────────────────────────────────────────────────────────

const router = Router();
const controller = new ProfileController();

/**
 * @route   GET /api/v1/profile and /api/v1/profile/me
 * @desc    Get currently authenticated user's fitness profile
 * @access  Private
 */
router.get(['/', '/me'], authenticateToken, controller.getMyProfile);

/**
 * @route   PUT /api/v1/profile and /api/v1/profile/me
 * @desc    Create or update currently authenticated user's profile
 * @access  Private
 */
router.put(['/', '/me'], authenticateToken, upsertProfileValidation, validateRequest, controller.updateMyProfile);

export const profileRouter = router;
