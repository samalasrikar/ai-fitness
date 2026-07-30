import { ProgressRepository } from './progress.repository';
import { DashboardMetrics } from './progress.types';

export class ProgressService {
  private readonly repo = new ProgressRepository();

  public async getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
    return this.repo.getMetrics(userId);
  }

  public async toggleChallenge(userId: string): Promise<boolean> {
    return this.repo.toggleChallenge(userId);
  }
}
