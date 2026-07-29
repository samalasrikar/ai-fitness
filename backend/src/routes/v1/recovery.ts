import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { ApiResponse } from '../../utils/ApiResponse';

export const recoveryRouter = Router();

// GET /api/v1/recovery/analysis
recoveryRouter.get('/analysis', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findFirst();
    const biometrics = await prisma.userBiometrics.findFirst({
      where: { userId: user?.id },
      orderBy: { date: 'desc' },
    });

    const insights = [
      {
        id: '1',
        title: 'Fueling Recommendation',
        icon: 'restaurant',
        description:
          'Your glycogen levels are stabilized. Prioritize magnesium-rich foods tonight to maintain nervous system recovery.',
      },
      {
        id: '2',
        title: 'Optimized Schedule',
        icon: 'fitness_center',
        description:
          'Recovery score is peak. You are cleared for High Intensity Intervals at 09:00 tomorrow for maximum adaptation.',
      },
    ];

    res.json(
      ApiResponse.success('Recovery analysis retrieved', {
        recoveryScore: biometrics?.recoveryScore || 92,
        stateStatus: biometrics?.stateStatus || 'Optimum State',
        sleepHours: biometrics?.sleepHours || '7h 45m',
        sleepChange: biometrics?.sleepChange || '+12% vs avg',
        stressLevel: biometrics?.stressLevel || 'Low',
        stressScore: biometrics?.stressScore || 14,
        hrv: biometrics?.hrv || 88,
        muscleReadiness: 'Peak Readiness',
        hotspots: [
          { name: 'Chest', topPct: 20, leftPct: 40 },
          { name: 'Quads L', topPct: 45, leftPct: 25 },
          { name: 'Quads R', topPct: 45, leftPct: 75 },
          { name: 'Forearms', topPct: 30, leftPct: 15 },
          { name: 'Core', topPct: 12, leftPct: 48 },
        ],
        insights,
      })
    );
  } catch (error) {
    next(error);
  }
});
