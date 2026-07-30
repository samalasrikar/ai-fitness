export interface OverloadData {
  weeklyVolumeProgress: { week: string; volumeKg: number }[];
  exerciseProgression: { name: string; startWeight: number; currentWeight: number; percentageIncrease: number }[];
  rpeDistribution: { rpe: number; count: number }[];
  deloadStatus: { recommended: boolean; reason: string; fatigueScore: number };
}

export interface PerformanceLabData {
  readinessScore: number;
  hrvTrendMs: { date: string; hrv: number }[];
  sleepHoursTrend: { date: string; hours: number }[];
  cnsRecoveryStatus: string;
  volumeCapacity: number; // percentage 0-100
}

export interface GoalDriftData {
  goalName: string;
  targetDate: string;
  progressPercentage: number;
  projectedCompletionDate: string;
  driftDays: number;
  recommendation: string;
}
