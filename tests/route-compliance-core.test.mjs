import test from "node:test";
import assert from "node:assert/strict";

import {
  evaluateRouteCompliance,
  trackingDistanceKm,
} from "../.dist/modulos/delivery/route-compliance-core/src.js";

test("route-compliance-core flags unavailable without path", () => {
  const result = evaluateRouteCompliance({
    tracking: [],
  });

  assert.equal(result.status, "unavailable");
});

test("route-compliance-core passes aligned tracking", () => {
  const result = evaluateRouteCompliance({
    deliveryOption: "express_toll",
    routePlan: {
      expectedDurationMin: 10,
      path: [
        { lat: -33.45, lng: -70.66 },
        { lat: -33.451, lng: -70.661 },
        { lat: -33.452, lng: -70.662 },
      ],
    },
    tracking: [
      { lat: -33.45, lng: -70.66, timestamp: "2026-01-01T10:00:00.000Z" },
      { lat: -33.451, lng: -70.661, timestamp: "2026-01-01T10:04:00.000Z" },
      { lat: -33.452, lng: -70.662, timestamp: "2026-01-01T10:09:00.000Z" },
    ],
  });

  assert.equal(result.status, "pass");
  assert.equal(result.inferredTagUsage, "likely");
  assert.ok(trackingDistanceKm([
    { lat: -33.45, lng: -70.66, timestamp: "2026-01-01T10:00:00.000Z" },
    { lat: -33.451, lng: -70.661, timestamp: "2026-01-01T10:04:00.000Z" },
  ]) > 0);
});
