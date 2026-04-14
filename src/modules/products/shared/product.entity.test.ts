import { describe, it, expect } from 'vitest';
import { Product } from './product.entity.js';

const now = new Date('2024-06-01T12:00:00.000Z');

const prismaRow = {
  id: 'abc-123',
  name: 'Test Product',
  description: 'A test product',
  imageUrl: 'https://example.com/img.png',
  emoji: '📦',
  quantity: 15,
  status: 'warning',
  createdAt: now,
  updatedAt: now,
};

describe('Product', () => {
  describe('fromPrisma', () => {
    it('creates a Product instance with all fields mapped', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const product = Product.fromPrisma(prismaRow as any);
      expect(product).toBeInstanceOf(Product);
      expect(product.id).toBe('abc-123');
      expect(product.name).toBe('Test Product');
      expect(product.description).toBe('A test product');
      expect(product.imageUrl).toBe('https://example.com/img.png');
      expect(product.emoji).toBe('📦');
      expect(product.quantity).toBe(15);
      expect(product.status).toBe('warning');
      expect(product.createdAt).toBe(now);
      expect(product.updatedAt).toBe(now);
    });

    it('handles null description and imageUrl', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const product = Product.fromPrisma({ ...prismaRow, description: null, imageUrl: null } as any);
      expect(product.description).toBeNull();
      expect(product.imageUrl).toBeNull();
    });
  });

  describe('toJSON', () => {
    it('serializes dates to ISO strings', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const product = Product.fromPrisma(prismaRow as any);
      const json = product.toJSON();
      expect(json.createdAt).toBe(now.toISOString());
      expect(json.updatedAt).toBe(now.toISOString());
    });

    it('includes all fields', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const product = Product.fromPrisma(prismaRow as any);
      const json = product.toJSON();
      expect(json).toMatchObject({
        id: 'abc-123',
        name: 'Test Product',
        description: 'A test product',
        imageUrl: 'https://example.com/img.png',
        emoji: '📦',
        quantity: 15,
        status: 'warning',
      });
    });
  });
});
