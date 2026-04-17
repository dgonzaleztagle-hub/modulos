import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatOrderType,
  formatRelativeTime,
  getFoodOpsNotificationCount,
  getLowStockProducts,
} from '../.dist/modulos/ops/food-ops-notification-core/src.js';

test('food-ops-notification-core detecta stock bajo', () => {
  const products = [
    { id: '1', name: 'Pan', stock_quantity: 2, price: 1000, min_stock: 5 },
    { id: '2', name: 'Cafe', stock_quantity: 12, price: 2000, min_stock: 5 },
  ];

  const lowStock = getLowStockProducts(products);
  assert.equal(lowStock.length, 1);
  assert.equal(lowStock[0].id, '1');
});

test('food-ops-notification-core suma pedidos y stock no visto', () => {
  const count = getFoodOpsNotificationCount(
    [{ id: 'ord1', order_number: '001', order_type: 'delivery', customer_name: null, total: 5000, created_at: '2026-04-16T10:00:00.000Z' }],
    [{ id: 'p1', name: 'Pan', stock_quantity: 1, price: 1000, min_stock: 5 }],
    new Set(),
  );

  assert.equal(count, 2);
});

test('food-ops-notification-core formatea tipo y tiempo', () => {
  assert.equal(formatOrderType('dine_in'), 'Mesa');
  assert.equal(
    formatRelativeTime('2026-04-16T10:00:00.000Z', new Date('2026-04-16T10:30:00.000Z')),
    'Hace 30m',
  );
});
