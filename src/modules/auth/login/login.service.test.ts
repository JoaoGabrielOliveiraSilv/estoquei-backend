import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { LoginService } from './login.service.js';
import { UnauthorizedError } from '../../../shared/errors/application.errors.js';

vi.mock('../../../env.js', () => ({
  env: {
    LOGIN_USERNAME: 'admin',
    LOGIN_PASSWORD: 'secret',
    JWT_SECRET: 'test-secret',
  },
}));

describe('LoginService', () => {
  const service = new LoginService();

  it('throws UnauthorizedError when username is wrong', async () => {
    await expect(
      service.execute({ username: 'wrong', password: 'secret' }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws UnauthorizedError when password is wrong', async () => {
    await expect(
      service.execute({ username: 'admin', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws UnauthorizedError with message "Invalid credentials"', async () => {
    await expect(
      service.execute({ username: 'admin', password: 'wrong' }),
    ).rejects.toThrow('Invalid credentials');
  });

  it('returns a signed JWT token when credentials are valid', async () => {
    const result = await service.execute({ username: 'admin', password: 'secret' });

    expect(result.token).toBeDefined();
    const decoded = jwt.verify(result.token, 'test-secret') as jwt.JwtPayload;
    expect(decoded.sub).toBe('1');
  });

  it('generates a token that expires in ~24h', async () => {
    const before = Math.floor(Date.now() / 1000);
    const result = await service.execute({ username: 'admin', password: 'secret' });
    const after = Math.floor(Date.now() / 1000);

    const decoded = jwt.decode(result.token) as jwt.JwtPayload;
    const expectedExp = before + 24 * 60 * 60;
    expect(decoded.exp).toBeGreaterThanOrEqual(expectedExp);
    expect(decoded.exp).toBeLessThanOrEqual(after + 24 * 60 * 60);
  });
});
