import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizePublicationStatus,
  buildPublicationRecord,
} from "../.dist/modulos/integrations/property-publisher-core/src.js";

test("property-publisher-core normaliza estados externos", () => {
  assert.equal(normalizePublicationStatus("ACTIVE"), "active");
  assert.equal(normalizePublicationStatus("cualquier-cosa"), "pending");
});

test("property-publisher-core arma record portable con nulls explícitos", () => {
  const record = buildPublicationRecord({ status: "active", url: "https://demo.cl" });
  assert.equal(record.externalId, null);
  assert.equal(record.status, "active");
});
