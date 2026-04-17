import test from "node:test";
import assert from "node:assert/strict";

import { rankDispatchCandidates } from "../.dist/modulos/delivery/dispatch-ranking-core/src.js";

test("dispatch-ranking-core sorts best driver first", () => {
  const ranked = rankDispatchCandidates({
    order: { pickupLat: -33.45, pickupLng: -70.66 },
    vehicles: [{ id: "v1", isActive: true }],
    drivers: [
      {
        id: "d1",
        fullName: "Driver Near",
        vehicleId: "v1",
        isActive: true,
        availabilityStatus: "online",
        onShift: true,
        lastLocation: { lat: -33.4502, lng: -70.6602 },
        rating: 5,
      },
      {
        id: "d2",
        fullName: "Driver Far",
        vehicleId: "v1",
        isActive: true,
        availabilityStatus: "busy",
        onShift: true,
        lastLocation: { lat: -33.55, lng: -70.76 },
        rating: 4,
      },
    ],
  });

  assert.equal(ranked[0].driverId, "d1");
});
