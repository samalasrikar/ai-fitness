import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { AuthRepository } from './auth.repository';
import {
  RegisterDTO,
  LoginDTO,
  AuthResponseDTO,
  UserResponseDTO,
  TokenPayload,
  AuthTokens,
  UserEntity,
} from './auth.types';
import { ApiError } from '../../utils/ApiError';
import { env } from '../../env';

const JWT_ISSUER = 'fitai-x';
const JWT_AUDIENCE = 'fitai-x-app';

// ─────────────────────────────────────────────────────────────────────────────
// Auth Service – Business Logic Layer
// Encapsulates authentication, token generation, token rotation & reuse detection
// ─────────────────────────────────────────────────────────────────────────────

export class AuthService {
  private readonly repository: AuthRepository;

  constructor(repository: AuthRepository = new AuthRepository()) {
    this.repository = repository;
  }

  /**
   * Registers a new user account
   */
  public async register(dto: RegisterDTO): Promise<AuthResponseDTO> {
    // Check if user already exists
    const existingUser = await this.repository.findByEmail(dto.email);
    if (existingUser) {
      throw ApiError.conflict('An account with this email address already exists');
    }

    // Hash password with salt round 12
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Create user in database
    const user = await this.repository.createUser({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    // Generate token pair with initial family ID
    const { tokens } = await this.issueTokenPair(user);

    return {
      user: this.mapToUserResponseDTO(user),
      tokens,
    };
  }

  /**
   * Authenticates user credentials and issues access & refresh tokens
   */
  public async login(dto: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.repository.findByEmail(dto.email);
    if (!user) {
      throw ApiError.unauthorized('Invalid email address or password');
    }

    // Compare passwords securely
    const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email address or password');
    }

    // Issue new token pair
    const { tokens } = await this.issueTokenPair(user);

    return {
      user: this.mapToUserResponseDTO(user),
      tokens,
    };
  }

  /**
   * Refreshes access token with Secure Token Rotation & Reuse Detection
   */
  public async refreshToken(rawRefreshToken: string): Promise<AuthTokens> {
    if (!rawRefreshToken) {
      throw ApiError.unauthorized('Refresh token is required');
    }

    let decoded: TokenPayload;
    try {
      const verifyOpts: VerifyOptions = {
        algorithms: ['HS256'],
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      };
      decoded = jwt.verify(rawRefreshToken, env.JWT_REFRESH_SECRET as Secret, verifyOpts) as TokenPayload;
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    // Check database record for token rotation / reuse detection
    const storedToken = await this.repository.findRefreshToken(rawRefreshToken);
    if (!storedToken) {
      throw ApiError.unauthorized('Invalid or unrecognised refresh token');
    }

    // ── REUSE DETECTION ──────────────────────────────────────────────────────
    if (storedToken.isRevoked) {
      // Security Incident! An already revoked token was presented again.
      // Immediately revoke all tokens in this family (containment)
      if (storedToken.familyId) {
        await this.repository.revokeTokenFamily(storedToken.familyId);
      } else {
        await this.repository.deleteRefreshTokensByUserId(storedToken.userId);
      }
      throw ApiError.unauthorized('Token reuse detected. All active sessions have been revoked.');
    }

    // Check expiration in DB
    if (new Date() > storedToken.expiresAt) {
      await this.repository.revokeRefreshToken(storedToken.id);
      throw ApiError.unauthorized('Refresh token has expired');
    }

    const user = await this.repository.findById(decoded.userId);
    if (!user) {
      throw ApiError.unauthorized('User associated with token no longer exists');
    }

    // Revoke current refresh token (rotation step 1)
    await this.repository.revokeRefreshToken(storedToken.id);

    // Issue new refresh token & access token in same family (rotation step 2)
    const { tokens } = await this.issueTokenPair(user, storedToken.familyId || undefined);

    return tokens;
  }

  /**
   * Logs out user by invalidating active refresh tokens
   */
  public async logout(userId: string): Promise<void> {
    await this.repository.deleteRefreshTokensByUserId(userId);
  }

  /**
   * Gets current user profile by ID
   */
  public async getCurrentUser(userId: string): Promise<UserResponseDTO> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw ApiError.notFound('User account not found');
    }
    return this.mapToUserResponseDTO(user);
  }

  /**
   * Helper to issue access + refresh token pair and persist hashed token to DB
   */
  private async issueTokenPair(user: UserEntity, existingFamilyId?: string): Promise<{ tokens: AuthTokens; familyId: string }> {
    const payload: TokenPayload = {
      id: user.id,
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const signOpts: SignOptions = {
      algorithm: 'HS256',
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    };

    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET as Secret, {
      ...signOpts,
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET as Secret, {
      ...signOpts,
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const saved = await this.repository.saveRefreshToken(user.id, refreshToken, expiresAt, existingFamilyId);

    return {
      tokens: { accessToken, refreshToken },
      familyId: saved.familyId,
    };
  }

  /**
   * Maps database entity to client-safe DTO
   */
  private mapToUserResponseDTO(user: UserEntity): UserResponseDTO {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isVerified: user.is_verified,
      createdAt: user.created_at.toISOString(),
    };
  }
}
