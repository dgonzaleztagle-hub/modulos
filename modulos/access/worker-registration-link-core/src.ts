import crypto from "node:crypto";

export function createWorkerRegistrationToken(factory?: () => string) {
  return factory ? factory() : crypto.randomUUID();
}

export function resolveWorkerRegistrationExpiry(daysValid: number, baseDate = new Date()) {
  const safeDays = Number.isFinite(daysValid) && daysValid > 0 ? Math.floor(daysValid) : 1;
  const expiresAt = new Date(baseDate);
  expiresAt.setDate(expiresAt.getDate() + safeDays);
  return expiresAt;
}

export function buildWorkerRegistrationLink(baseUrl: string, token: string) {
  const normalized = baseUrl.replace(/\/+$/, "");
  return `${normalized}/registro-trabajador/${token}`;
}
