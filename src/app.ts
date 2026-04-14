import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { authRoutes } from './modules/auth/auth.routes.js';
import { productRoutes } from './modules/products/product.routes.js';
import { errorHandler } from './shared/middlewares/errorHandler.js';
import { authMiddleware } from './shared/middlewares/auth.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({
      data: { ok: true },
      message: 'Service is healthy',
    });
  });

  app.use('/auth', authRoutes);
  app.use('/products', authMiddleware, productRoutes);

  app.use((_req, res) => {
    res.status(404).json({
      error: 'Not found',
      statusCode: 404,
    });
  });

  app.use(errorHandler);

  return app;
}
