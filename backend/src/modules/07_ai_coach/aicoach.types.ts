export interface ChatMessage {
  id?: string;
  userId?: string;
  sender: 'user' | 'coach';
  text: string;
  createdAt?: Date;
}
