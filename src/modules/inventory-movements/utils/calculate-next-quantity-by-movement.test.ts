import { describe, it, expect } from 'vitest';
import { calculateNextQuantityByMovement } from './calculate-next-quantity-by-movement.js';

describe('calculateNextQuantityByMovement', () => {
  describe('inbound', () => {
    it('adds the movement quantity to the current stock', () => {
      expect(calculateNextQuantityByMovement(10, { type: 'inbound', quantity: 5 })).toBe(15);
    });

    it('adds to zero stock', () => {
      expect(calculateNextQuantityByMovement(0, { type: 'inbound', quantity: 10 })).toBe(10);
    });
  });

  describe('outbound', () => {
    it('subtracts the movement quantity from the current stock', () => {
      expect(calculateNextQuantityByMovement(10, { type: 'outbound', quantity: 3 })).toBe(7);
    });

    it('returns 0 when outbound quantity equals current stock', () => {
      expect(calculateNextQuantityByMovement(5, { type: 'outbound', quantity: 5 })).toBe(0);
    });

    it('returns 0 when outbound quantity exceeds current stock', () => {
      expect(calculateNextQuantityByMovement(5, { type: 'outbound', quantity: 10 })).toBe(0);
    });
  });
});
