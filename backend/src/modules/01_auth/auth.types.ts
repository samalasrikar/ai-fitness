import { Request } from 'express';
import { AuthenticatedUser } from '../../types/express';

// ─────────────────────────────────────────────────────────────────────────────
// Authentication Types & DTOs
// ─────────────────────────────────────────────────────────────────────────────

export interface UserEntity {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: 'USER' | 'ADMIN';
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  isVerified: boolean;
  createdAt: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface TokenPayload extends AuthenticatedUser {
  id: string;
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseDTO {
  user: UserResponseDTO;
  tokens: AuthTokens;
}

export type AuthenticatedRequest = Request;
