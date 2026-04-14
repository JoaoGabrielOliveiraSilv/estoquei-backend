import { describe, it, expect } from 'vitest';
import { getProductStatusByQuantity } from './get-product-status-by-quantity.js';

describe('getProductStatusByQuantity', () => {
  it('returns danger when quantity is 0', () => {
    expect(getProductStatusByQuantity(0)).toBe('danger');
  });

  it('returns danger when quantity is negative', () => {
    expect(getProductStatusByQuantity(-1)).toBe('danger');
  });

  it('returns warning when quantity is 1', () => {
    expect(getProductStatusByQuantity(1)).toBe('warning');
  });

  it('returns warning when quantity is exactly 20', () => {
    expect(getProductStatusByQuantity(20)).toBe('warning');
  });

  it('returns normal when quantity is 21', () => {
    expect(getProductStatusByQuantity(21)).toBe('normal');
  });

  it('returns normal for large quantities', () => {
    expect(getProductStatusByQuantity(1000)).toBe('normal');
  });
});
