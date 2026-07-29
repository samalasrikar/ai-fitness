import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
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

// ─────────────────────────────────────────────────────────────────────────────
// Auth Service – Business Logic Layer
// Encapsulates authentication, token generation, security rules & hashing
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

    // Generate tokens
    const tokens = this.generateTokens({
      id: user.id,
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token hash in DB
    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await this.repository.saveRefreshToken(user.id, refreshTokenHash, expiresAt);

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

    // Generate tokens
    const tokens = this.generateTokens({
      id: user.id,
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Save refresh token hash in database
    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.repository.saveRefreshToken(user.id, refreshTokenHash, expiresAt);

    return {
      user: this.mapToUserResponseDTO(user),
      tokens,
    };
  }

  /**
   * Refreshes access token given a valid refresh token
   */
  public async refreshToken(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken) {
      throw ApiError.unauthorized('Refresh token is required');
    }

    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET as Secret) as TokenPayload;
      const user = await this.repository.findById(decoded.userId);
      if (!user) {
        throw ApiError.unauthorized('User associated with token no longer exists');
      }

      // Generate new tokens (token rotation)
      const newTokens = this.generateTokens({
        id: user.id,
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return newTokens;
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }
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
   * Helper to sign JWT access and refresh tokens
   */
  private generateTokens(payload: TokenPayload): AuthTokens {
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET as Secret, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET as Secret, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });

    return { accessToken, refreshToken };
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
