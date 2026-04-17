import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWebNotification,
  parsePushPayload,
  resolveNotificationClickTarget,
} from '../.dist/modulos/notifications/push-notification-sw-core/src.js';

test('push-notification-sw-core usa fallback de texto si json falla', () => {
  const payload = parsePushPayload({
    json: () => {
      throw new Error('bad payload');
    },
    text: () => 'Hola',
  });

  assert.equal(payload.title, 'Vuelve+');
  assert.equal(payload.body, 'Hola');
});

test('push-notification-sw-core arma notificación con defaults', () => {
  const notification = buildWebNotification({ body: 'Reserva confirmada' });
  assert.equal(notification.title, 'Vuelve+');
  assert.equal(notification.options.data.url, '/cliente');
});

test('push-notification-sw-core resuelve click target', () => {
  assert.equal(resolveNotificationClickTarget({ data: { url: '/cliente/123' } }), '/cliente/123');
});
