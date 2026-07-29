import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { ApiResponse } from '../../utils/ApiResponse';

export const workoutRouter = Router();

// GET /api/v1/workout/current
workoutRouter.get('/current', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findFirst();
    const workout = await prisma.workoutSession.findFirst({
      where: { userId: user?.id },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(ApiResponse.success('Current workout session retrieved', { workout }));
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/workout/exercise/toggle
workoutRouter.post('/exercise/toggle', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionExerciseId } = req.body;
    if (!sessionExerciseId) {
      res.status(400).json(ApiResponse.error('sessionExerciseId is required'));
      return;
    }

    const item = await prisma.workoutSessionExercise.findUnique({
      where: { id: sessionExerciseId },
    });

    if (!item) {
      res.status(404).json(ApiResponse.error('Session exercise not found'));
      return;
    }

    const updated = await prisma.workoutSessionExercise.update({
      where: { id: sessionExerciseId },
      data: { isCompleted: !item.isCompleted },
    });

    const allSessionExercises = await prisma.workoutSessionExercise.findMany({
      where: { workoutSessionId: item.workoutSessionId },
    });

    const completed = allSessionExercises.filter((e) => e.isCompleted).length;
    const total = allSessionExercises.length;
    const progressPct = Math.round((completed / (total || 1)) * 100);

    await prisma.workoutSession.update({
      where: { id: item.workoutSessionId },
      data: {
        completedCount: completed,
        totalCount: total,
        progressPct,
      },
    });

    res.json(ApiResponse.success('Exercise state toggled', { item: updated, progressPct }));
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/workout/ai-creator/messages
workoutRouter.get('/ai-creator/messages', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findFirst();
    const messages = await prisma.aiChat.findMany({
      where: { userId: user?.id },
      orderBy: { createdAt: 'asc' },
    });

    res.json(ApiResponse.success('AI chat messages retrieved', { messages }));
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/workout/ai-creator/prompt
workoutRouter.post('/ai-creator/prompt', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { message } = req.body;
    const user = await prisma.user.findFirst();

    if (!user) {
      res.status(404).json(ApiResponse.error('User not found'));
      return;
    }

    const userMsg = await prisma.aiChat.create({
      data: {
        userId: user.id,
        sender: 'USER',
        message: message || 'Generate optimal workout',
      },
    });

    let replyText = `FitAI Core has calculated your optimal training split. Recommending a target session tailored for maximum metabolic response.`;
    let metricsText = `HRV: 82ms | Target Cal: 500 kcal`;

    if (message?.toLowerCase().includes('fat-loss') || message?.toLowerCase().includes('circuit')) {
      replyText = `Generated a high-density Fat-Loss Circuit with 45s rest intervals and maximum TUT (Time Under Tension).`;
      metricsText = `Burn: 580 kcal | Intensity: 88%`;
    } else if (message?.toLowerCase().includes('mobility')) {
      replyText = `Formulated a joint decompression & active mobility sequence focusing on thoracic extension and hip openers.`;
      metricsText = `TUT: 30 min | Recovery: +15%`;
    } else if (message?.toLowerCase().includes('rdl') || message?.toLowerCase().includes('deadlift')) {
      replyText = `Substituted Conventional Deadlifts with Romanian Deadlifts (RDLs) to minimize spinal compression while maintaining hamstring overload.`;
      metricsText = `Sets: 4 | Load: 80% 1RM`;
    }

    const aiMsg = await prisma.aiChat.create({
      data: {
        userId: user.id,
        sender: 'FITAI_CORE',
        message: replyText,
        metrics: metricsText,
      },
    });

    res.json(ApiResponse.success('AI response generated', { userMsg, aiMsg }));
  } catch (error) {
    next(error);
  }
});
