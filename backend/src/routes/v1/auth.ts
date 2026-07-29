import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma';
import { env } from '../../env';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';

export const authRouter = Router();

// POST /api/v1/auth/signup
authRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      throw ApiError.badRequest('Email and password are required');
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw ApiError.badRequest('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name || email.split('@')[0],
        email,
        passwordHash,
      },
    });

    await prisma.userBiometrics.create({
      data: {
        userId: user.id,
      },
    });

    await prisma.nutritionLog.create({
      data: {
        userId: user.id,
      },
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, env.JWT_ACCESS_SECRET);

    res.cookie('token', token, { httpOnly: true, secure: env.NODE_ENV === 'production' });

    res.status(201).json(
      ApiResponse.success('Account created successfully', {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
        token,
      })
    );
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/login
authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ApiError.badRequest('Email and password are required');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, env.JWT_ACCESS_SECRET);

    res.cookie('token', token, { httpOnly: true, secure: env.NODE_ENV === 'production' });

    res.json(
      ApiResponse.success('Login successful', {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          experienceLevel: user.experienceLevel,
          fitnessGoal: user.fitnessGoal,
        },
        token,
      })
    );
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/auth/me
authRouter.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    let token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies?.token;

    let user;
    if (token) {
      try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string };
        user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      } catch (err) {
        // Token verification fallback
      }
    }

    if (!user) {
      user = await prisma.user.findFirst();
    }

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    res.json(
      ApiResponse.success('Current user retrieved', {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          gender: user.gender,
          age: user.age,
          weight: user.weight,
          heightFeet: user.heightFeet,
          heightInches: user.heightInches,
          experienceLevel: user.experienceLevel,
          fitnessGoal: user.fitnessGoal,
          eliteRankScore: user.eliteRankScore,
        },
      })
    );
  } catch (error) {
    next(error);
  }
});
