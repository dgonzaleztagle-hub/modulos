import test from "node:test";
import assert from "node:assert/strict";
import {
  buildMapSurfaceConfig,
  buildMapFlyToPayload,
  normalizeMapMarkers,
  buildMapMarkerPopupHtml,
} from "../.dist/modulos/geo/map-surface-core/src.js";

test("map-surface-core arma config y flyTo", () => {
  const config = buildMapSurfaceConfig({ lat: -33.45, lng: -70.66 });
  assert.deepEqual(config.center, [-70.66, -33.45]);
  assert.equal(config.zoom, 14);

  const flyTo = buildMapFlyToPayload({ lat: -33.45, lng: -70.66 }, 16);
  assert.deepEqual(flyTo.center, [-70.66, -33.45]);
  assert.equal(flyTo.zoom, 16);
});

test("map-surface-core normaliza marcadores y popups", () => {
  const markers = normalizeMapMarkers([
    { lat: -33.45, lng: -70.66, title: "Depto Centro", subtitle: "$120M" },
  ]);

  assert.equal(markers[0].accentColor, "#3b82f6");
  assert.match(buildMapMarkerPopupHtml(markers[0]), /Depto Centro/);
  assert.match(buildMapMarkerPopupHtml(markers[0]), /\$120M/);
});
