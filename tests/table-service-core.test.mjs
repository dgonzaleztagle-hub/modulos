import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMoveOrderPlan,
  calculateTableTotal,
  getTableStatusLabel,
  getTableStatusTone,
} from '../.dist/modulos/pos/table-service-core/src.js';

test('table-service-core resuelve labels y tonos', () => {
  assert.equal(getTableStatusLabel('occupied'), 'Ocupada');
  assert.equal(getTableStatusTone('reserved'), 'warning');
});

test('table-service-core calcula total por mesa', () => {
  const total = calculateTableTotal(
    {
      t1: [{ id: 'o1', total: 5000 }, { id: 'o2', total: 2000 }],
    },
    't1',
  );

  assert.equal(total, 7000);
});

test('table-service-core construye plan de movimiento', () => {
  const plan = buildMoveOrderPlan({
    orderId: 'o1',
    sourceTableId: 't1',
    targetTableId: 't2',
    remainingSourceOrders: 0,
  });

  assert.equal(plan.orderUpdate.nextTableId, 't2');
  assert.equal(plan.sourceTableUpdate.status, 'available');
  assert.equal(plan.targetTableUpdate.status, 'occupied');
});
