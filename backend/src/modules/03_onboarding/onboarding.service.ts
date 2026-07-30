import { OnboardingRepository } from './onboarding.repository';
import { OnboardingDTO, OnboardingRecord } from './onboarding.types';

export class OnboardingService {
  private readonly repo = new OnboardingRepository();

  public async saveOnboarding(userId: string, dto: OnboardingDTO): Promise<OnboardingRecord> {
    return this.repo.upsert(userId, dto);
  }

  public async getOnboardingStatus(userId: string): Promise<OnboardingRecord | null> {
    return this.repo.findByUserId(userId);
  }
}
