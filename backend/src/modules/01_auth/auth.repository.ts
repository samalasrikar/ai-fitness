import { db } from '../../config/database';
import { UserEntity } from './auth.types';
import crypto from 'crypto';

export interface RefreshTokenEntity {
  id: string;
  userId: string;
  tokenHash: string;
  familyId: string | null;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth Repository – PostgreSQL Data Access Layer
// Uses parameterized SQL queries exclusively to prevent SQL Injection
// ─────────────────────────────────────────────────────────────────────────────

export class AuthRepository {
  /**
   * Initializes users and refresh_tokens tables if they do not exist
   */
  public async initTables(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'USER',
        is_verified BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL,
        family_id UUID,
        is_revoked BOOLEAN NOT NULL DEFAULT false,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS family_id UUID;
      ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS is_revoked BOOLEAN DEFAULT false;

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON refresh_tokens(token_hash);
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family ON refresh_tokens(family_id);
    `;
    await db.query(query);
  }

  /**
   * Finds a user by email using parameterized query
   */
  public async findByEmail(email: string): Promise<UserEntity | null> {
    const query = `
      SELECT id, email, password_hash, first_name, last_name, role, is_verified, created_at, updated_at
      FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
    `;
    const result = await db.query<UserEntity>(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Finds a user by ID using parameterized query
   */
  public async findById(id: string): Promise<UserEntity | null> {
    const query = `
      SELECT id, email, password_hash, first_name, last_name, role, is_verified, created_at, updated_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `;
    const result = await db.query<UserEntity>(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Creates a new user record
   */
  public async createUser(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
  }): Promise<UserEntity> {
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, password_hash, first_name, last_name, role, is_verified, created_at, updated_at
    `;
    const values = [data.email.toLowerCase(), data.passwordHash, data.firstName, data.lastName];
    const result = await db.query<UserEntity>(query, values);
    return result.rows[0];
  }

  /**
   * Fast SHA-256 helper for hashing refresh tokens before DB storage
   */
  public hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Stores a hashed refresh token in DB with optional family ID
   */
  public async saveRefreshToken(
    userId: string,
    rawToken: string,
    expiresAt: Date,
    familyId?: string
  ): Promise<{ id: string; familyId: string }> {
    const tokenHash = this.hashToken(rawToken);
    const fid = familyId || crypto.randomUUID();

    const query = `
      INSERT INTO refresh_tokens (user_id, token_hash, family_id, expires_at)
      VALUES ($1, $2, $3, $4)
      RETURNING id, family_id
    `;
    const result = await db.query(query, [userId, tokenHash, fid, expiresAt]);
    return {
      id: result.rows[0].id,
      familyId: result.rows[0].family_id,
    };
  }

  /**
   * Finds a refresh token record by raw token string
   */
  public async findRefreshToken(rawToken: string): Promise<RefreshTokenEntity | null> {
    const tokenHash = this.hashToken(rawToken);
    const query = `
      SELECT id, user_id as "userId", token_hash as "tokenHash", family_id as "familyId", is_revoked as "isRevoked", expires_at as "expiresAt", created_at as "createdAt"
      FROM refresh_tokens
      WHERE token_hash = $1
      LIMIT 1
    `;
    const result = await db.query<RefreshTokenEntity>(query, [tokenHash]);
    return result.rows[0] || null;
  }

  /**
   * Marks a specific refresh token as revoked
   */
  public async revokeRefreshToken(id: string): Promise<void> {
    const query = `UPDATE refresh_tokens SET is_revoked = true WHERE id = $1`;
    await db.query(query, [id]);
  }

  /**
   * Reuse Detection: Revokes ALL refresh tokens in a family immediately (theft containment)
   */
  public async revokeTokenFamily(familyId: string): Promise<void> {
    const query = `UPDATE refresh_tokens SET is_revoked = true WHERE family_id = $1`;
    await db.query(query, [familyId]);
  }

  /**
   * Removes all refresh tokens for a given user
   */
  public async deleteRefreshTokensByUserId(userId: string): Promise<void> {
    const query = `DELETE FROM refresh_tokens WHERE user_id = $1`;
    await db.query(query, [userId]);
  }
}
