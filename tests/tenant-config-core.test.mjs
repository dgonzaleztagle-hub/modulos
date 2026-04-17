import test from "node:test";
import assert from "node:assert/strict";

import {
  isFeatureEnabled,
  isTenantActive,
  normalizeTenantSlug,
  pickEnabledFeatures,
  resolveRuntimeConfig,
} from "../.dist/modulos/tenancy/tenant-config-core/src.js";

test("tenant-config-core normalizes slug and merges runtime config", () => {
  const runtime = resolveRuntimeConfig({
    tenant: {
      id: "t1",
      name: "Clínica Ñuñoa Prime",
    },
    brandingDefaults: {
      appName: "Base App",
    },
    brandingOverrides: {
      primaryColor: "#111111",
    },
    featureDefaults: {
      bookings: true,
      crm: false,
    },
    featureOverrides: {
      crm: true,
    },
    limitDefaults: {
      users: 5,
    },
  });

  assert.equal(runtime.tenant.slug, "clinica-nunoa-prime");
  assert.equal(runtime.tenant.status, "active");
  assert.equal(runtime.branding.appName, "Base App");
  assert.equal(runtime.branding.primaryColor, "#111111");
  assert.equal(isFeatureEnabled(runtime.features, "crm"), true);
  assert.deepEqual(pickEnabledFeatures(runtime.features), ["bookings", "crm"]);
});

test("tenant-config-core exposes active-state helpers", () => {
  assert.equal(normalizeTenantSlug("  Demo Tenant  "), "demo-tenant");
  assert.equal(isTenantActive({ id: "t2", name: "Demo", status: "trialing" }), true);
  assert.equal(isTenantActive({ id: "t3", name: "Demo", status: "suspended" }), false);
});
