import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { ApiResponse } from '../../utils/ApiResponse';

export const userRouter = Router();

// PUT /api/v1/user/onboarding
userRouter.put('/onboarding', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { gender, age, weight, heightFeet, heightInches, experienceLevel, fitnessGoal } = req.body;

    const user = await prisma.user.findFirst();
    if (!user) {
      res.status(404).json(ApiResponse.error('User not found'));
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(gender && { gender }),
        ...(age && { age: Number(age) }),
        ...(weight && { weight: Number(weight) }),
        ...(heightFeet && { heightFeet: Number(heightFeet) }),
        ...(heightInches && { heightInches: Number(heightInches) }),
        ...(experienceLevel && { experienceLevel }),
        ...(fitnessGoal && { fitnessGoal }),
      },
    });

    res.json(ApiResponse.success('Onboarding details updated successfully', { user: updatedUser }));
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/user/profile
userRouter.get('/profile', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findFirst({
      include: {
        biometrics: { orderBy: { date: 'desc' }, take: 1 },
        nutritionLogs: { orderBy: { date: 'desc' }, take: 1 },
      },
    });

    res.json(ApiResponse.success('User profile retrieved', { user }));
  } catch (error) {
    next(error);
  }
});
