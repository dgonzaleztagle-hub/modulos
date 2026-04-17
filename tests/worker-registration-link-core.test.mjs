import test from "node:test";
import assert from "node:assert/strict";
import {
  createWorkerRegistrationToken,
  resolveWorkerRegistrationExpiry,
  buildWorkerRegistrationLink,
} from "../.dist/modulos/access/worker-registration-link-core/src.js";

test("worker-registration-link-core genera token y link", () => {
  const token = createWorkerRegistrationToken(() => "tok-123");
  assert.equal(token, "tok-123");
  assert.equal(
    buildWorkerRegistrationLink("https://pluscontable.cl/", token),
    "https://pluscontable.cl/registro-trabajador/tok-123",
  );
});

test("worker-registration-link-core calcula expiración por días", () => {
  const expiresAt = resolveWorkerRegistrationExpiry(2, new Date("2026-04-16T00:00:00Z"));
  assert.equal(expiresAt.toISOString(), "2026-04-18T00:00:00.000Z");
});
