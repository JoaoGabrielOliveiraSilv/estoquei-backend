import type { NextFunction, Request, Response } from 'express';
import { AbstractController } from '../../../shared/base/abstract.controller.js';
import { CreateMovementService } from './create-movement.service.js';
import type { CreateMovementDTO } from '../shared/movement.dto.js';

export class CreateMovementController extends AbstractController {
  constructor(private readonly createMovementService: CreateMovementService) {
    super();
  }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.dispatch(next, async () => {
      const body = req.body as CreateMovementDTO;
      const movement = await this.createMovementService.execute(body);
      this.success(res, 201, movement.toJSON(), 'Movement recorded');
    });
  }
}
