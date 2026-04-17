import crypto from 'node:crypto';

export const CREDENTIALS_ENCRYPTION_ALGORITHM = 'aes-256-gcm';

export type EncryptedPayload = {
  iv: string;
  encrypted: string;
  authTag: string;
};

export function deriveEncryptionKey(secret: string) {
  if (!secret?.trim()) {
    throw new Error('Encryption secret is required');
  }

  return Buffer.from(secret.padEnd(64, '0').slice(0, 64), 'hex');
}

export function encryptCredentials(
  credentials: Record<string, string>,
  secret: string,
): string {
  const key = deriveEncryptionKey(secret);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(CREDENTIALS_ENCRYPTION_ALGORITHM, key, iv);

  let encrypted = cipher.update(JSON.stringify(credentials), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return JSON.stringify({
    iv: iv.toString('hex'),
    encrypted,
    authTag: cipher.getAuthTag().toString('hex'),
  } satisfies EncryptedPayload);
}

export function decryptCredentials(
  encryptedData: string,
  secret: string,
): Record<string, string> {
  const key = deriveEncryptionKey(secret);
  const payload = JSON.parse(encryptedData) as EncryptedPayload;
  const decipher = crypto.createDecipheriv(
    CREDENTIALS_ENCRYPTION_ALGORITHM,
    key,
    Buffer.from(payload.iv, 'hex'),
  );

  decipher.setAuthTag(Buffer.from(payload.authTag, 'hex'));

  let decrypted = decipher.update(payload.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted) as Record<string, string>;
}
