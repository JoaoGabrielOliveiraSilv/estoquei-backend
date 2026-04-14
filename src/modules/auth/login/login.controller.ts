import type { NextFunction, Request, Response } from 'express';
import { AbstractController } from '../../../shared/base/abstract.controller.js';
import { LoginService } from './login.service.js';
import type { LoginBodyDTO } from './login.dto.js';

export class LoginController extends AbstractController {
  constructor(private readonly loginService: LoginService) {
    super();
  }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.dispatch(next, async () => {
      const body = req.body as LoginBodyDTO;
      const result = await this.loginService.execute(body);
      this.success(res, 200, result);
    });
  }
}
