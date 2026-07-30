import { body, ValidationChain } from 'express-validator';
import { validateRequest } from '../01_auth/auth.validation';

// ─────────────────────────────────────────────────────────────────────────────
// User Profile Input Validation Rules (Flexible for full or partial updates)
// ─────────────────────────────────────────────────────────────────────────────

export const upsertProfileValidation: ValidationChain[] = [
  body('age')
    .optional()
    .isInt({ min: 12, max: 120 })
    .withMessage('Age must be a whole number between 12 and 120'),

  body('gender')
    .optional()
    .isIn(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'])
    .withMessage('Gender must be MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY'),

  body('heightCm')
    .optional()
    .isFloat({ min: 50, max: 300 })
    .withMessage('Height must be between 50 cm and 300 cm'),

  body('weightKg')
    .optional()
    .isFloat({ min: 20, max: 500 })
    .withMessage('Weight must be between 20 kg and 500 kg'),

  body('weight')
    .optional()
    .isFloat({ min: 20, max: 500 })
    .withMessage('Weight must be between 20 kg and 500 kg'),

  body('targetWeightKg')
    .optional()
    .isFloat({ min: 20, max: 500 })
    .withMessage('Target weight must be between 20 kg and 500 kg'),

  body('fitnessGoal')
    .optional()
    .isIn(['WEIGHT_LOSS', 'MUSCLE_GAIN', 'MAINTENANCE', 'ENDURANCE', 'STRENGTH'])
    .withMessage('Invalid fitness goal selected'),

  body('activityLevel')
    .optional()
    .isIn(['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTRA_ACTIVE'])
    .withMessage('Invalid activity level selected'),

  body('experienceLevel')
    .optional()
    .isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'Elite', 'Elite Hypertrophy'])
    .withMessage('Invalid experience level selected'),

  body('fitnessLevel')
    .optional()
    .isString(),

  body('displayName')
    .optional()
    .isString()
    .trim(),

  body('dietaryPreference')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .escape(),

  body('medicalConditions')
    .optional()
    .isArray()
    .withMessage('Medical conditions must be an array of strings'),
];

export { validateRequest };
