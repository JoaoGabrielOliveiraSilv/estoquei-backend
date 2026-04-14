import { Router } from 'express';
import { validateBody } from '../../shared/middlewares/validate.js';
import { loginBodySchema } from './login/login.dto.js';
import { LoginService } from './login/login.service.js';
import { LoginController } from './login/login.controller.js';

const loginController = new LoginController(new LoginService());

export const authRoutes = Router();

authRoutes.post('/login', validateBody(loginBodySchema), (req, res, next) => {
  void loginController.handle(req, res, next);
});
