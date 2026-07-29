import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { ApiResponse } from '../../utils/ApiResponse';

export const recordsRouter = Router();

// GET /api/v1/records
recordsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findFirst();
    const records = await prisma.fitnessRecord.findMany({
      where: { userId: user?.id },
      orderBy: { createdAt: 'desc' },
    });

    const radarStats = {
      power: 85,
      endurance: 78,
      agility: 82,
      recovery: 90,
      flexibility: 70,
      speed: 75,
    };

    const dailyBurnTrend = [40, 65, 80, 55, 90, 70, 85, 45, 60, 75, 95, 60, 50, 80];

    res.json(
      ApiResponse.success('Fitness records retrieved', {
        user: {
          name: user?.name,
          eliteRankScore: user?.eliteRankScore || 750,
          percentile: 'top 2%',
        },
        radarStats,
        dailyBurnTrend,
        avgBurn: 3240,
        records,
      })
    );
  } catch (error) {
    next(error);
  }
});
