import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildEmailHtml,
  buildMailtoLink,
  buildWhatsAppLink,
  personalizeTemplate,
} from '../.dist/modulos/crm/outreach-message-core/src.js';

test('outreach-message-core personaliza placeholders', () => {
  const result = personalizeTemplate('Hola {{nombre}}', { nombre: 'Daniel' });
  assert.equal(result, 'Hola Daniel');
});

test('outreach-message-core arma html con firma', () => {
  const html = buildEmailHtml('Linea 1\nLinea 2', {
    companyName: 'PlusContable',
    contactEmail: 'contacto@example.com',
  });

  assert.match(html, /Linea 1/);
  assert.match(html, /contacto@example.com/);
});

test('outreach-message-core resuelve links rápidos', () => {
  assert.equal(buildWhatsAppLink('+56 9 1234 5678'), 'https://wa.me/56912345678');
  assert.equal(buildMailtoLink('demo@example.com'), 'mailto:demo@example.com');
});
