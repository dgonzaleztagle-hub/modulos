import test from 'node:test';
import assert from 'node:assert/strict';
import { parseEmailBody, parseSenderIdentity } from '../.dist/modulos/crm/email-parsing-core/src.js';

test('parseEmailBody limpia html y genera preview', () => {
  const raw = [
    'Content-Type: text/html; charset="utf-8"',
    '',
    '<html><body><p>Hola&nbsp;Mundo</p><a href="https://example.com">Ver</a></body></html>',
  ].join('\n');

  const parsed = parseEmailBody(raw);
  assert.equal(parsed.body, 'Hola Mundo\n\nVer (https://example.com)');
  assert.match(parsed.preview, /Hola Mundo/);
});

test('parseEmailBody decodifica quoted printable', () => {
  const raw = [
    'Content-Type: text/plain; charset="utf-8"',
    'Content-Transfer-Encoding: quoted-printable',
    '',
    'Hola=20se=C3=B1or',
  ].join('\n');

  const parsed = parseEmailBody(raw);
  assert.equal(parsed.body, 'Hola señor');
});

test('parseSenderIdentity extrae email y dominio', () => {
  const sender = parseSenderIdentity('Equipo Demo <ventas@example.com>');
  assert.equal(sender.email, 'ventas@example.com');
  assert.equal(sender.domain, 'example.com');
});
