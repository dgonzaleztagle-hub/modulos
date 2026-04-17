import test from "node:test";
import assert from "node:assert/strict";

import {
  buildTenantPath,
  calculateTenantShellStatus,
  resolveTenantShellBranding,
} from "../.dist/modulos/tenancy/tenant-shell-core/src.js";

test("tenant-shell-core resolves branding and prefixed path", () => {
  const branding = resolveTenantShellBranding({
    tenant: { slug: "demo", nombre: "Tenant Demo", logo_url: "/logo.png" },
    config: { app_name: "App Demo", responsable_titulo: "CEO" },
  });

  assert.equal(branding.appName, "App Demo");
  assert.equal(buildTenantPath("/dashboard", "demo"), "/demo/dashboard");
});

test("tenant-shell-core detects expiring paid plan", () => {
  const status = calculateTenantShellStatus(
    { slug: "demo", plan: "ilimitado", is_active: true, plan_expires_at: "2026-01-05T00:00:00.000Z" },
    new Date("2026-01-01T00:00:00.000Z"),
  );

  assert.equal(status.isPaidPlan, true);
  assert.equal(status.isPlanExpiring, true);
});
