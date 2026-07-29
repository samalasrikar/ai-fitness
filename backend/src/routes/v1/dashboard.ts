import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { ApiResponse } from '../../utils/ApiResponse';

export const dashboardRouter = Router();

// GET /api/v1/dashboard/stats
dashboardRouter.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findFirst();
    const userId = user?.id || '';

    const biometrics = await prisma.userBiometrics.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    const activeWorkout = await prisma.workoutSession.findFirst({
      where: { userId },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const nutrition = await prisma.nutritionLog.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    res.json(
      ApiResponse.success('Dashboard stats retrieved', {
        user: {
          name: user?.name,
          avatarUrl: user?.avatarUrl,
          eliteRankScore: user?.eliteRankScore,
        },
        biometrics: biometrics || {
          recoveryScore: 88,
          stateStatus: 'Prime State',
          hrv: 62,
          restingHeartRate: 62,
          caloriesBurned: 1240,
          stepsCount: '8.4k',
        },
        activeWorkout: activeWorkout || null,
        nutrition: nutrition || {
          targetCalories: 2800,
          consumedCalories: 1950,
          proteinGrams: 142,
          targetProtein: 180,
          carbsGrams: 210,
          targetCarbs: 300,
          fatsGrams: 55,
          targetFats: 75,
        },
      })
    );
  } catch (error) {
    next(error);
  }
});
