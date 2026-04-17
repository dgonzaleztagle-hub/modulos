import test from "node:test";
import assert from "node:assert/strict";

import {
  decodeGooglePolyline,
  estimateFallbackRoute,
  estimateRoutePlanPortable,
  geocodeAddressPortable,
} from "../.dist/modulos/geo/route-planning-core/src.js";

test("route-planning-core decodifica polyline de google", () => {
  const points = decodeGooglePolyline("_p~iF~ps|U_ulLnnqC_mqNvxq`@");
  assert.equal(points.length, 3);
  assert.deepEqual(points[0], { lat: 38.5, lng: -120.2 });
});

test("route-planning-core usa fallback haversine", () => {
  const plan = estimateFallbackRoute({ lat: -33.45, lng: -70.66 }, { lat: -33.42, lng: -70.61 });
  assert.equal(plan.provider, "fallback_haversine");
  assert.ok(plan.distanceKm > 0);
  assert.ok(plan.path.length > 2);
});

test("route-planning-core usa OSRM cuando responde el fetcher", async () => {
  const fetcher = async () => ({
    ok: true,
    async json() {
      return {
        code: "Ok",
        routes: [
          {
            distance: 10400,
            duration: 1800,
            geometry: { coordinates: [[-70.66, -33.45], [-70.61, -33.42]] },
          },
        ],
      };
    },
  });

  const plan = await estimateRoutePlanPortable(
    { lat: -33.45, lng: -70.66 },
    { lat: -33.42, lng: -70.61 },
    { fetcher },
  );

  assert.equal(plan.provider, "osrm");
  assert.equal(plan.durationMin, 30);
});

test("route-planning-core geocodea por fallback nominatim", async () => {
  const fetcher = async () => ({
    ok: true,
    async json() {
      return [{ lat: "-33.45", lon: "-70.66", display_name: "Santiago, Chile" }];
    },
  });

  const point = await geocodeAddressPortable("Santiago Centro", { fetcher });
  assert.deepEqual(point, { lat: -33.45, lng: -70.66, displayName: "Santiago, Chile" });
});
