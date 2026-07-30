import { Pool } from 'pg';
import { env } from '../env';
import { logger } from './logger';

// ─────────────────────────────────────────────────────────────────────────────
// PostgreSQL Connection Pool Setup (node-postgres)
// Parameterized, secure, and production-grade connection pool
// ─────────────────────────────────────────────────────────────────────────────

const isSSLRequired = env.DATABASE_URL.includes('render.com') || env.IS_PRODUCTION;

export const db = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: isSSLRequired ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

db.on('error', (err) => {
  logger.error('Unexpected error on idle PostgreSQL client', err);
});

export async function checkDatabaseConnection(): Promise<void> {
  try {
    const client = await db.connect();
    const result = await client.query('SELECT NOW()');
    
    // Auto-initialize base auth schema
    await client.query(`
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

      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        age INT NOT NULL,
        gender VARCHAR(30) NOT NULL,
        height_cm NUMERIC(5,2) NOT NULL,
        weight_kg NUMERIC(5,2) NOT NULL,
        target_weight_kg NUMERIC(5,2),
        fitness_goal VARCHAR(50) NOT NULL,
        activity_level VARCHAR(50) NOT NULL,
        experience_level VARCHAR(50) NOT NULL,
        dietary_preference VARCHAR(100),
        medical_conditions TEXT[],
        bmr NUMERIC(7,2),
        tdee NUMERIC(7,2),
        target_calories NUMERIC(7,2),
        target_protein_g NUMERIC(7,2),
        target_carbs_g NUMERIC(7,2),
        target_fat_g NUMERIC(7,2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS onboarding_protocols (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        gender VARCHAR(30),
        age INT,
        weight NUMERIC(5,2),
        height_ft INT,
        height_in INT,
        fitness_level VARCHAR(50),
        frequency VARCHAR(50),
        location VARCHAR(50),
        duration VARCHAR(50),
        selected_goal VARCHAR(100),
        is_completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS workout_plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(150) NOT NULL,
        duration VARCHAR(50) NOT NULL,
        exercises JSONB NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS meal_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(150) NOT NULL,
        meal_type VARCHAR(50) NOT NULL,
        time_label VARCHAR(50) NOT NULL,
        calories INT NOT NULL,
        protein INT NOT NULL,
        carbs INT NOT NULL,
        fat INT NOT NULL,
        img_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ai_chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        sender VARCHAR(20) NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_streaks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        active_days_count INT DEFAULT 14,
        has_joined_challenge BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
      CREATE INDEX IF NOT EXISTS idx_workout_plans_user ON workout_plans(user_id);
      CREATE INDEX IF NOT EXISTS idx_meal_logs_user ON meal_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_user ON ai_chat_messages(user_id);
    `);

    client.release();
    logger.info(`✅ PostgreSQL connected & schemas verified at ${result.rows[0].now}`);
  } catch (error) {
    logger.error('❌ PostgreSQL connection failed:', error);
    logger.error('Please verify your DATABASE_URL in .env and ensure PostgreSQL is accessible.');
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await db.end();
  logger.info('PostgreSQL pool connection closed.');
}
