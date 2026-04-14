import { describe, it, expect } from 'vitest';
import { InventoryMovement } from './inventory-movement.entity.js';

const now = new Date('2024-06-01T12:00:00.000Z');

const prismaRow = {
  id: 1,
  productId: 'product-abc',
  type: 'inbound',
  quantity: 50,
  counterPartyName: 'Supplier Co.',
  date: '2024-06-01',
  createdAt: now,
};

describe('InventoryMovement', () => {
  describe('fromPrisma', () => {
    it('creates an InventoryMovement instance with all fields mapped', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const movement = InventoryMovement.fromPrisma(prismaRow as any);
      expect(movement).toBeInstanceOf(InventoryMovement);
      expect(movement.id).toBe(1);
      expect(movement.productId).toBe('product-abc');
      expect(movement.type).toBe('inbound');
      expect(movement.quantity).toBe(50);
      expect(movement.counterPartyName).toBe('Supplier Co.');
      expect(movement.date).toBe('2024-06-01');
      expect(movement.createdAt).toBe(now);
    });
  });

  describe('toJSON', () => {
    it('serializes createdAt to ISO string', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const movement = InventoryMovement.fromPrisma(prismaRow as any);
      const json = movement.toJSON();
      expect(json.createdAt).toBe(now.toISOString());
    });

    it('includes all fields', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const movement = InventoryMovement.fromPrisma(prismaRow as any);
      const json = movement.toJSON();
      expect(json).toMatchObject({
        id: 1,
        productId: 'product-abc',
        type: 'inbound',
        quantity: 50,
        counterPartyName: 'Supplier Co.',
        date: '2024-06-01',
      });
    });
  });
});
