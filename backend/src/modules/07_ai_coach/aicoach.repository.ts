import { db } from '../../config/database';
import { ChatMessage } from './aicoach.types';

export interface InjuryLogItem {
  id: string;
  userId: string;
  bodyPart: string;
  discomfortLevel: number;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
}

export class AICoachRepository {
  public async getHistory(userId: string): Promise<ChatMessage[]> {
    const result = await db.query(
      'SELECT * FROM ai_chat_messages WHERE user_id = $1 ORDER BY created_at ASC',
      [userId]
    );
    if (result.rows.length === 0) {
      // Seed default welcoming message
      const defaultMsg = await this.saveMessage(
        userId,
        'coach',
        'Hello! I am your FITAIX Coach. How can I optimize your workout or nutrition plan today?'
      );
      return [defaultMsg];
    }
    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      sender: row.sender as 'user' | 'coach',
      text: row.text,
      createdAt: row.created_at,
    }));
  }

  public async saveMessage(userId: string, sender: 'user' | 'coach', text: string): Promise<ChatMessage> {
    const result = await db.query(
      'INSERT INTO ai_chat_messages (user_id, sender, text) VALUES ($1, $2, $3) RETURNING *',
      [userId, sender, text]
    );
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      sender: row.sender as 'user' | 'coach',
      text: row.text,
      createdAt: row.created_at,
    };
  }

  // ── Injury Guard ─────────────────────────────────────────────────────────────
  public async getInjuryLogs(userId: string): Promise<InjuryLogItem[]> {
    const res = await db.query(
      'SELECT * FROM injury_logs WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC',
      [userId]
    );
    return res.rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      bodyPart: r.body_part,
      discomfortLevel: Number(r.discomfort_level),
      notes: r.notes,
      isActive: r.is_active,
      createdAt: r.created_at,
    }));
  }

  public async createInjuryLog(userId: string, data: { bodyPart: string; discomfortLevel: number; notes?: string }): Promise<InjuryLogItem> {
    const res = await db.query(
      `INSERT INTO injury_logs (user_id, body_part, discomfort_level, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, data.bodyPart, data.discomfortLevel || 5, data.notes || null]
    );
    const r = res.rows[0];
    return {
      id: r.id,
      userId: r.user_id,
      bodyPart: r.body_part,
      discomfortLevel: Number(r.discomfort_level),
      notes: r.notes,
      isActive: r.is_active,
      createdAt: r.created_at,
    };
  }
}
