export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

export interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export const RATE_LIMIT_CONFIG = {
  LOGIN: { maxAttempts: 5, windowMs: 15 * 60 * 1000 },
  API: { maxAttempts: 100, windowMs: 60 * 1000 },
} as const;

export function getRateLimitKey(ip: string, endpoint: string) {
  return `${ip}:${endpoint}`;
}

export function checkRateLimitRecord(
  record: RateLimitRecord | null | undefined,
  config: RateLimitConfig,
  now = Date.now(),
) {
  if (!record || now > record.resetTime) {
    return {
      nextRecord: { count: 1, resetTime: now + config.windowMs },
      result: {
        allowed: true,
        remaining: config.maxAttempts - 1,
        resetIn: config.windowMs,
      },
    };
  }

  const nextRecord = {
    count: record.count + 1,
    resetTime: record.resetTime,
  };

  return {
    nextRecord,
    result: {
      allowed: nextRecord.count <= config.maxAttempts,
      remaining: Math.max(0, config.maxAttempts - nextRecord.count),
      resetIn: record.resetTime - now,
    },
  };
}

export function pruneExpiredRateLimitEntries(entries: Array<[string, RateLimitRecord]>, now = Date.now()) {
  return entries.filter(([, value]) => now <= value.resetTime);
}
