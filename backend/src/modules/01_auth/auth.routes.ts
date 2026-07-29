import { Router } from 'express';
import { AuthController } from './auth.controller';
import { registerValidation, loginValidation, validateRequest } from './auth.validation';
import { authenticateToken } from './auth.middleware';

// ─────────────────────────────────────────────────────────────────────────────
// Auth Router
// Endpoint definitions with input validation & authentication middleware
// ─────────────────────────────────────────────────────────────────────────────

const router = Router();
const authController = new AuthController();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, validateRequest, authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user & get tokens
 * @access  Public
 */
router.post('/login', loginValidation, validateRequest, authController.login);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public (requires refresh token in cookie/body)
 */
router.post('/refresh', authController.refresh);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user & invalidate tokens
 * @access  Private
 */
router.post('/logout', authenticateToken, authController.logout);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get currently authenticated user details
 * @access  Private
 */
router.get('/me', authenticateToken, authController.getMe);

export const authRouter = router;
