import { db } from '../../config/database';
import { UserEntity } from './auth.types';

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
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
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
   * Stores a hashed refresh token in DB
   */
  public async saveRefreshToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    const query = `
      INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
      VALUES ($1, $2, $3)
    `;
    await db.query(query, [userId, tokenHash, expiresAt]);
  }

  /**
   * Removes all refresh tokens for a given user
   */
  public async deleteRefreshTokensByUserId(userId: string): Promise<void> {
    const query = `DELETE FROM refresh_tokens WHERE user_id = $1`;
    await db.query(query, [userId]);
  }
}
