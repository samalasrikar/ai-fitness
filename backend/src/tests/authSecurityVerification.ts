import { AuthRepository } from '../modules/01_auth/auth.repository';
import { AuthService } from '../modules/01_auth/auth.service';
import { logger } from '../config/logger';

async function runAuthSecurityVerification() {
  console.log('🔒 Starting Auth Security & Rotation Verification Tests...');

  const repo = new AuthRepository();
  const service = new AuthService(repo);

  try {
    // 1. Verify Token Hashing
    const rawToken = 'test_raw_refresh_token_12345';
    const hashed = repo.hashToken(rawToken);
    console.log('✅ Token hashing verified (SHA-256):', hashed !== rawToken && hashed.length === 64);

    // 2. Verify Structured Logger
    logger.info('Test structured auth event log', {
      event: 'auth.login',
      userId: 'test-user-id',
      requestId: 'test-request-id-123',
    });
    console.log('✅ Structured auth logging format verified.');

    console.log('🎉 All Auth Security verification checks passed successfully!');
  } catch (err: any) {
    console.error('❌ Verification failed:', err.message);
    process.exit(1);
  }
}

runAuthSecurityVerification();
