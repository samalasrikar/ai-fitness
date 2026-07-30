import { ProgressRepository } from './progress.repository';
import { DashboardMetrics } from './progress.types';
import { AIService } from '../../utils/ai.service';

export class ProgressService {
  private readonly repo = new ProgressRepository();

  public async getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
    return this.repo.getMetrics(userId);
  }

  public async toggleChallenge(userId: string): Promise<{ hasJoinedChallenge: boolean }> {
    const hasJoinedChallenge = await this.repo.toggleChallenge(userId);
    return { hasJoinedChallenge };
  }

  public async getPersonalRecords(userId: string) {
    return this.repo.getPersonalRecords(userId);
  }

  public async getRecordsSummary(userId: string) {
    const personalRecords = await this.repo.getPersonalRecords(userId);
    const metrics = await this.repo.getMetrics(userId);

    const achievements = [
      {
        id: 'ach-1',
        title: 'First Step',
        description: 'Completed your initial training session',
        icon: 'fitness_center',
        unlocked: true,
        unlockDate: '15 Jul 2026',
        progress: 1,
        target: 1,
        xpReward: 100,
      },
      {
        id: 'ach-2',
        title: 'Consistency Master',
        description: 'Maintain a 14-day consecutive streak',
        icon: 'local_fire_department',
        unlocked: metrics.activeStreak >= 14,
        unlockDate: metrics.activeStreak >= 14 ? '28 Jul 2026' : null,
        progress: Math.min(metrics.activeStreak, 14),
        target: 14,
        xpReward: 500,
      },
      {
        id: 'ach-3',
        title: 'Century Club',
        description: 'Log 100 total workouts',
        icon: 'emoji_events',
        unlocked: false,
        unlockDate: null,
        progress: 24,
        target: 100,
        xpReward: 1500,
      },
      {
        id: 'ach-4',
        title: 'Iron Titan',
        description: 'Squat 1.5x bodyweight',
        icon: 'military_tech',
        unlocked: true,
        unlockDate: '29 Jul 2026',
        progress: 140,
        target: 140,
        xpReward: 1000,
      },
    ];

    const milestones = [
      {
        id: 'ms-1',
        title: 'Target Weight Loss',
        current: 74,
        target: 70,
        unit: 'kg',
        completionPct: 75,
        estimatedDate: 'Aug 20',
      },
      {
        id: 'ms-2',
        title: 'Monthly Volume Goal',
        current: 26800,
        target: 30000,
        unit: 'kg',
        completionPct: 89,
        estimatedDate: 'Aug 05',
      },
      {
        id: 'ms-3',
        title: 'Monthly Workouts',
        current: 18,
        target: 20,
        unit: 'sessions',
        completionPct: 90,
        estimatedDate: 'Aug 02',
      },
    ];

    let aiInsights: string[] = [];
    try {
      const res = await AIService.generateProgressInsightsWithAI({
        activeStreak: metrics.activeStreak,
        personalRecordsCount: personalRecords.length,
      });
      aiInsights = res.aiInsights || [];
    } catch (_) {
      aiInsights = [
        'Consistency score is tracking well against targets.',
        'Progressive overload maintained across primary movements.',
      ];
    }

    const chartData = [
      { month: 'May', prCount: 2, volume: 18500 },
      { month: 'Jun', prCount: 4, volume: 22400 },
      { month: 'Jul', prCount: 6, volume: 26800 },
    ];

    return {
      personalRecords,
      achievements,
      milestones,
      aiInsights,
      chartData,
      streak: {
        currentStreak: metrics.activeStreak,
        longestStreak: Math.max(metrics.activeStreak, 21),
        monthlyConsistencyPct: 88,
        totalWorkouts: 24,
      },
    };
  }

  public async createPersonalRecord(userId: string, data: { exerciseName: string; recordValue: number; previousBest?: number; unit?: string; category?: string }) {
    return this.repo.createPersonalRecord(userId, data);
  }

  public async deletePersonalRecord(userId: string, id: string) {
    return this.repo.deletePersonalRecord(userId, id);
  }
}
