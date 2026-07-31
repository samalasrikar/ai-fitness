import { Router } from 'express';
import { AuthController } from './auth.controller';
import { registerValidation, loginValidation, validateRequest } from './auth.validation';
import { authenticateToken } from './auth.middleware';
import { createRateLimiter } from '../../middleware/rateLimiter';

// ─────────────────────────────────────────────────────────────────────────────
// Auth Router
// Endpoint definitions with input validation & authentication middleware
// Rate limited for protection against brute force and auth flooding
// ─────────────────────────────────────────────────────────────────────────────

const router = Router();
const authController = new AuthController();

const loginLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 15, message: 'Too many login attempts. Please try again in 15 minutes.' });
const registerLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many registration attempts. Please try again in 15 minutes.' });
const refreshLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 60, message: 'Too many refresh attempts.' });

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerLimiter, registerValidation, validateRequest, authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user & get tokens
 * @access  Public
 */
router.post('/login', loginLimiter, loginValidation, validateRequest, authController.login);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public (requires refresh token in cookie/body)
 */
router.post('/refresh', refreshLimiter, authController.refresh);

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
