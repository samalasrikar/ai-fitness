import { db } from '../../config/database';
import { ChatMessage } from './aicoach.types';

export class AICoachRepository {
  public async getHistory(userId: string): Promise<ChatMessage[]> {
    const result = await db.query(
      'SELECT * FROM ai_chat_messages WHERE user_id = $1 ORDER BY created_at ASC',
      [userId]
    );
    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      sender: row.sender as 'user' | 'coach',
      text: row.text,
      createdAt: row.created_at
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
      createdAt: row.created_at
    };
  }
}
