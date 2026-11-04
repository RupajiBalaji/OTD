import { describe, it, expect } from 'vitest';
import { PasswordUtil } from '../../src/utils/password';
import { JwtUtil } from '../../src/utils/jwt';

describe('Auth Utilities & Password Unit Tests', () => {
  it('should hash a password securely using Argon2id', async () => {
    const rawPassword = 'SecurePassword123!';
    const hashed = await PasswordUtil.hash(rawPassword);

    expect(hashed).toBeDefined();
    expect(hashed).not.toBe(rawPassword);
    expect(hashed.startsWith('$argon2id$')).toBe(true);
  });

  it('should verify matching candidate password against hash', async () => {
    const rawPassword = 'BespokeFashion2026';
    const hashed = await PasswordUtil.hash(rawPassword);

    const isMatch = await PasswordUtil.compare(rawPassword, hashed);
    expect(isMatch).toBe(true);

    const isWrongMatch = await PasswordUtil.compare('WrongPassword', hashed);
    expect(isWrongMatch).toBe(false);
  });

  it('should sign and verify valid JWT access tokens', () => {
    const payload = {
      userId: 'usr_luxury_123',
      email: 'curator@otd.com',
      role: 'user',
    };

    const token = JwtUtil.signAccessToken(payload);
    expect(token).toBeDefined();

    const verified = JwtUtil.verifyAccessToken(token);
    expect(verified.userId).toBe(payload.userId);
    expect(verified.email).toBe(payload.email);
  });

  it('should sign and verify valid JWT refresh tokens', () => {
    const payload = {
      userId: 'usr_luxury_456',
      email: 'stylist@otd.com',
      role: 'curator',
    };

    const refreshToken = JwtUtil.signRefreshToken(payload);
    expect(refreshToken).toBeDefined();

    const verified = JwtUtil.verifyRefreshToken(refreshToken);
    expect(verified.userId).toBe(payload.userId);
  });
});
