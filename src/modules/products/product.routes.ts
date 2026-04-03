import { Router } from 'express';
import { prisma } from '../../shared/database/prisma.js';
import { validateBody, validateParams, validateQuery } from '../../shared/middlewares/validate.js';
import {
  createProductSchema,
  listProductsQuerySchema,
  productIdParamSchema,
  updateProductSchema,
} from './shared/product.dto.js';
import { ProductRepository } from './repositories/product.repository.js';
import { ListProductsService } from './list-products/list-products.service.js';
import { ListProductsController } from './list-products/list-products.controller.js';
import { GetProductByIdService } from './get-product-by-id/get-product-by-id.service.js';
import { GetProductByIdController } from './get-product-by-id/get-product-by-id.controller.js';
import { CreateProductService } from './create-product/create-product.service.js';
import { CreateProductController } from './create-product/create-product.controller.js';
import { UpdateProductService } from './update-product/update-product.service.js';
import { UpdateProductController } from './update-product/update-product.controller.js';
import { DeleteProductService } from './delete-product/delete-product.service.js';
import { DeleteProductController } from './delete-product/delete-product.controller.js';
import { InventoryMovementRepository } from '../inventory-movements/repositories/inventory-movement.repository.js';
import {
  createMovementBodySchema,
  movementsProductIdParamSchema,
} from '../inventory-movements/shared/movement.dto.js';
import { ListMovementsService } from '../inventory-movements/list-movements/list-movements.service.js';
import { ListMovementsController } from '../inventory-movements/list-movements/list-movements.controller.js';
import { CreateMovementService } from '../inventory-movements/create-movement/create-movement.service.js';
import { CreateMovementController } from '../inventory-movements/create-movement/create-movement.controller.js';

const productRepository = new ProductRepository(prisma);
const inventoryMovementRepository = new InventoryMovementRepository(prisma);

const listProductsController = new ListProductsController(new ListProductsService(productRepository));

const getProductByIdController = new GetProductByIdController(
  new GetProductByIdService(productRepository),
);

const createProductController = new CreateProductController(new CreateProductService(productRepository));

const updateProductController = new UpdateProductController(new UpdateProductService(productRepository));

const deleteProductController = new DeleteProductController(new DeleteProductService(productRepository));

const listMovementsController = new ListMovementsController(
  new ListMovementsService(productRepository, inventoryMovementRepository),
);

const createMovementController = new CreateMovementController(
  new CreateMovementService(productRepository, inventoryMovementRepository, prisma),
);

export const productRoutes = Router();

productRoutes.get('/', validateQuery(listProductsQuerySchema), (req, res, next) => {
  void listProductsController.handle(req, res, next);
});

productRoutes.post('/', validateBody(createProductSchema), (req, res, next) => {
  void createProductController.handle(req, res, next);
});

productRoutes.get(
  '/:productId/movements',
  validateParams(movementsProductIdParamSchema),
  (req, res, next) => {
    void listMovementsController.handle(req, res, next);
  },
);

productRoutes.post(
  '/:productId/movements',
  validateParams(movementsProductIdParamSchema),
  validateBody(createMovementBodySchema),
  (req, res, next) => {
    void createMovementController.handle(req, res, next);
  },
);

productRoutes.get('/:id', validateParams(productIdParamSchema), (req, res, next) => {
  void getProductByIdController.handle(req, res, next);
});

productRoutes.put('/:id', validateParams(productIdParamSchema), validateBody(updateProductSchema), (req, res, next) => {
  void updateProductController.handle(req, res, next);
});

productRoutes.delete('/:id', validateParams(productIdParamSchema), (req, res, next) => {
  void deleteProductController.handle(req, res, next);
});
