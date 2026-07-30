import { AICoachRepository } from './aicoach.repository';
import { ChatMessage } from './aicoach.types';

export class AICoachService {
  private readonly repo = new AICoachRepository();

  public async getHistory(userId: string): Promise<ChatMessage[]> {
    return this.repo.getHistory(userId);
  }

  public async sendMessage(userId: string, userText: string): Promise<ChatMessage> {
    await this.repo.saveMessage(userId, 'user', userText);

    let reply = "That sounds great! Keep pushing hard and let me know if you need any adjustments.";
    const lower = userText.toLowerCase();
    if (lower.includes('plan') || lower.includes('workout')) {
      reply = "I highly recommend starting with the 'Hypertrophy Push A' routine today to build upper chest volume. Should I lock that in for you?";
    } else if (lower.includes('sore') || lower.includes('pain')) {
      reply = "Understood. Make sure to prioritize hydration and active mobility today. We can scale down the intensity or focus on recovery metrics.";
    } else if (lower.includes('water') || lower.includes('hydrate')) {
      reply = "Excellent. Shoot for another 500ml before your workout. It will help optimize cellular volume and muscle pumps!";
    }

    return this.repo.saveMessage(userId, 'coach', reply);
  }
}
