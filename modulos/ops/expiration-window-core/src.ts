export function getDaysUntilExpiration(expiryDate: string | null | undefined, now = new Date()) {
  if (!expiryDate) return 0;
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function resolveExpirationCheckpoint(daysUntilExpiration: number) {
  if (daysUntilExpiration < 0) return "expired";
  if ([5, 3, 1].includes(daysUntilExpiration)) return `warn_${daysUntilExpiration}`;
  return "none";
}

export function shouldSendExpirationNotification(
  daysUntilExpiration: number,
  preferences?: { expirations?: boolean | null } | null,
) {
  if ((preferences?.expirations ?? true) !== true) return false;
  return resolveExpirationCheckpoint(daysUntilExpiration) !== "none";
}
