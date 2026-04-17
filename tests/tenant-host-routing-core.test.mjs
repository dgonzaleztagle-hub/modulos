import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getTenantFromHost,
  isAllowedCorsOrigin,
  shouldRewriteTenantHome,
} from '../.dist/modulos/tenancy/tenant-host-routing-core/src.js';

test('tenant-host-routing-core extrae tenant válido', () => {
  assert.equal(getTenantFromHost('demo.superpanel.lat'), 'demo');
});

test('tenant-host-routing-core ignora localhost y vercel preview', () => {
  assert.equal(getTenantFromHost('localhost:3000'), null);
  assert.equal(getTenantFromHost('demo.vercel.app'), null);
});

test('tenant-host-routing-core valida cors y rewrite', () => {
  assert.equal(isAllowedCorsOrigin('https://app.example.com', ['https://app.example.com']), true);
  assert.equal(shouldRewriteTenantHome('demo', '/'), true);
});
