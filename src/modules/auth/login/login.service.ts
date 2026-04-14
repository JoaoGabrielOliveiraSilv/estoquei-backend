import jwt from 'jsonwebtoken';
import { AbstractService } from '../../../shared/base/abstract.service.js';
import { UnauthorizedError } from '../../../shared/errors/application.errors.js';
import { env } from '../../../env.js';
import type { LoginBodyDTO } from './login.dto.js';

export type LoginResult = { token: string };

export class LoginService extends AbstractService<[LoginBodyDTO], LoginResult> {
  constructor() {
    super();
  }

  override async execute(data: LoginBodyDTO): Promise<LoginResult> {
    if (data.username !== env.LOGIN_USERNAME || data.password !== env.LOGIN_PASSWORD) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign({ sub: '1' }, env.JWT_SECRET, {
      expiresIn: '24h',
      algorithm: 'HS256',
    });

    return { token };
  }
}
