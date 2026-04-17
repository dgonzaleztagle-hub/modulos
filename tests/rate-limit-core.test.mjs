import test from "node:test";
import assert from "node:assert/strict";

import {
  RATE_LIMIT_CONFIG,
  checkRateLimitRecord,
  getRateLimitKey,
  pruneExpiredRateLimitEntries,
} from "../.dist/modulos/ops/rate-limit-core/src.js";

test("rate-limit-core genera llave y evalúa ventana", () => {
  const first = checkRateLimitRecord(null, RATE_LIMIT_CONFIG.LOGIN, 1000);
  const second = checkRateLimitRecord(first.nextRecord, RATE_LIMIT_CONFIG.LOGIN, 1001);

  assert.equal(getRateLimitKey("127.0.0.1", "/login"), "127.0.0.1:/login");
  assert.equal(first.result.allowed, true);
  assert.equal(second.result.remaining, 3);
});

test("rate-limit-core prunea expirados", () => {
  const pruned = pruneExpiredRateLimitEntries(
    [
      ["a", { count: 1, resetTime: 100 }],
      ["b", { count: 1, resetTime: 1000 }],
    ],
    500,
  );

  assert.deepEqual(pruned.map(([key]) => key), ["b"]);
});
