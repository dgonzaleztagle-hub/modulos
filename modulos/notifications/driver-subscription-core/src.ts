export interface DriverPushSubscription {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface DriverPushSettingsValue {
  byDriver?: Record<string, DriverPushSubscription[]>;
}

export function sanitizePushSubscription(input: unknown): DriverPushSubscription | null {
  if (!input || typeof input !== "object") return null;
  const row = input as Record<string, unknown>;
  const endpoint = typeof row.endpoint === "string" ? row.endpoint.trim() : "";
  const keys = (row.keys ?? {}) as Record<string, unknown>;
  const p256dh = typeof keys.p256dh === "string" ? keys.p256dh.trim() : "";
  const auth = typeof keys.auth === "string" ? keys.auth.trim() : "";
  if (!endpoint || !p256dh || !auth) return null;

  const expirationTime =
    typeof row.expirationTime === "number" && Number.isFinite(row.expirationTime)
      ? row.expirationTime
      : null;

  return {
    endpoint,
    expirationTime,
    keys: { p256dh, auth },
  };
}

export function getDriverSubscriptions(value: unknown, driverId: string): DriverPushSubscription[] {
  if (!value || typeof value !== "object") return [];
  const byDriver = (value as DriverPushSettingsValue).byDriver;
  const rawList = Array.isArray(byDriver?.[driverId]) ? byDriver[driverId] : [];
  const subscriptions: DriverPushSubscription[] = [];

  for (const item of rawList) {
    const sanitized = sanitizePushSubscription(item);
    if (sanitized) subscriptions.push(sanitized);
  }

  return subscriptions;
}

export function upsertDriverSubscription(
  value: unknown,
  driverId: string,
  subscription: DriverPushSubscription,
): DriverPushSettingsValue {
  const source = value && typeof value === "object" ? (value as DriverPushSettingsValue) : {};
  const byDriver = { ...(source.byDriver ?? {}) };
  const current = Array.isArray(byDriver[driverId]) ? [...byDriver[driverId]] : [];
  const deduped = current.filter((item) => item.endpoint !== subscription.endpoint);
  deduped.push(subscription);
  byDriver[driverId] = deduped;
  return { byDriver };
}

export function removeDriverSubscription(
  value: unknown,
  driverId: string,
  endpoint: string,
): DriverPushSettingsValue {
  const source = value && typeof value === "object" ? (value as DriverPushSettingsValue) : {};
  const byDriver = { ...(source.byDriver ?? {}) };
  const current = Array.isArray(byDriver[driverId]) ? [...byDriver[driverId]] : [];
  byDriver[driverId] = current.filter((item) => item.endpoint !== endpoint);
  return { byDriver };
}
