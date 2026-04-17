import test from 'node:test';
import assert from 'node:assert/strict';
import {
  decryptCredentials,
  deriveEncryptionKey,
  encryptCredentials,
} from '../.dist/modulos/access/credentials-encryption-core/src.js';

test('deriveEncryptionKey exige secreto', () => {
  assert.throws(() => deriveEncryptionKey(''), /Encryption secret is required/);
});

test('encryptCredentials y decryptCredentials hacen roundtrip', () => {
  const secret = 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
  const credentials = { apiKey: '123', secret: '456' };
  const encrypted = encryptCredentials(credentials, secret);
  const decrypted = decryptCredentials(encrypted, secret);
  const payload = JSON.parse(encrypted);

  assert.deepEqual(decrypted, credentials);
  assert.equal(typeof payload.encrypted, 'string');
  assert.equal(payload.encrypted.includes('123'), false);
});
