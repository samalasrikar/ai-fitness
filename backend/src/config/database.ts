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
    await client.query('SELECT NOW()');

    // Auto-initialize base auth and progress tracking schemas
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
        family_id UUID,
        is_revoked BOOLEAN NOT NULL DEFAULT false,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS family_id UUID;
      ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS is_revoked BOOLEAN DEFAULT false;

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
        display_name VARCHAR(150),
        username VARCHAR(100),
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

      CREATE TABLE IF NOT EXISTS personal_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        exercise_name VARCHAR(150) NOT NULL,
        record_value NUMERIC(8,2) NOT NULL,
        previous_best NUMERIC(8,2),
        unit VARCHAR(20) DEFAULT 'kg',
        category VARCHAR(50) DEFAULT 'Strength',
        achieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS workout_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(150) NOT NULL,
        duration_seconds INT NOT NULL DEFAULT 0,
        total_volume_kg NUMERIC(10,2) DEFAULT 0,
        calories_burned INT DEFAULT 0,
        rpe_avg NUMERIC(4,2) DEFAULT 8.0,
        ai_feedback TEXT,
        rating INT DEFAULT 5,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS workout_session_sets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
        exercise_name VARCHAR(150) NOT NULL,
        set_number INT NOT NULL,
        weight_kg NUMERIC(8,2) NOT NULL,
        reps INT NOT NULL,
        rpe NUMERIC(4,2) DEFAULT 8.0,
        completed BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS workout_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(150) NOT NULL,
        category VARCHAR(50) DEFAULT 'Custom',
        estimated_duration_min INT DEFAULT 45,
        difficulty VARCHAR(50) DEFAULT 'Intermediate',
        exercises JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS meal_plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(150) NOT NULL,
        target_calories INT NOT NULL,
        diet_type VARCHAR(50) DEFAULT 'Balanced',
        meals JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS water_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount_ml INT NOT NULL,
        logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Clean up old sample seed meals from database table
    await client.query(`
      DELETE FROM meal_logs 
      WHERE title IN ('Post-Workout Oatmeal & Whey', 'Grilled Chicken Breast & Quinoa');
    `).catch(() => {});

    client.release();
    logger.info('✅ PostgreSQL connection pool initialized and schema verified');
  } catch (error) {
    logger.error('❌ Failed to connect to PostgreSQL database:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await db.end();
  logger.info('PostgreSQL connection pool closed.');
}
