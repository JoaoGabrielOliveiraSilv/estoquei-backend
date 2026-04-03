import { Router } from 'express';
import { prisma } from '../../shared/database/prisma.js';
import { validateBody, validateQuery } from '../../shared/middlewares/validate.js';
import { ProductRepository } from '../products/repositories/product.repository.js';
import { createMovementSchema, listMovementsQuerySchema } from './shared/movement.dto.js';
import { InventoryMovementRepository } from './repositories/inventory-movement.repository.js';
import { ListMovementsService } from './list-movements/list-movements.service.js';
import { ListMovementsController } from './list-movements/list-movements.controller.js';
import { CreateMovementService } from './create-movement/create-movement.service.js';
import { CreateMovementController } from './create-movement/create-movement.controller.js';

const productRepository = new ProductRepository(prisma);
const inventoryMovementRepository = new InventoryMovementRepository(prisma);

const listMovementsController = new ListMovementsController(
  new ListMovementsService(inventoryMovementRepository),
);

const createMovementController = new CreateMovementController(
  new CreateMovementService(productRepository, inventoryMovementRepository, prisma),
);

export const movementRoutes = Router();

movementRoutes.get('/', validateQuery(listMovementsQuerySchema), (req, res, next) => {
  void listMovementsController.handle(req, res, next);
});

movementRoutes.post('/', validateBody(createMovementSchema), (req, res, next) => {
  void createMovementController.handle(req, res, next);
});
