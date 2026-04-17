import test from "node:test";
import assert from "node:assert/strict";

import {
  buildGuardianTrackingSummary,
  buildTrackingSnapshot,
  buildVehicleLiveSnapshot,
  buildVehicleMarkerPayload,
  calculateStopProgress,
} from "../.dist/modulos/delivery/tracking-core/src.js";

test("tracking-core calcula progreso por stops completados", () => {
  const progress = calculateStopProgress(
    [
      { id: "a", label: "Colegio" },
      { id: "b", label: "Casa 1" },
      { id: "c", label: "Casa 2" },
    ],
    ["a", "b"],
  );

  assert.equal(progress, 0.67);
});

test("tracking-core arma snapshot live con vehículo y progreso", () => {
  const snapshot = buildTrackingSnapshot({
    orderId: "trip-1",
    status: "in_transit",
    currentLocation: "Av. Apoquindo",
    etaMin: 8,
    vehicle: {
      driverId: "driver-1",
      vehicleId: "BUS-12",
      label: "Furgón 12",
      coordinate: { lat: -33.41234567, lng: -70.61234567 },
      speedKph: 38.42,
      updatedAt: "2026-04-17T11:00:00.000Z",
    },
    plannedStops: [
      { id: "stop-1", label: "Colegio", status: "completed" },
      { id: "stop-2", label: "Casa Benja" },
    ],
    completedStopIds: ["stop-1"],
    events: [
      { type: "assigned", label: "Conductor asignado", timestamp: "2026-04-17T10:40:00.000Z" },
      { type: "picked_up", label: "Niños abordo", timestamp: "2026-04-17T10:50:00.000Z", location: "Colegio" },
    ],
  });

  assert.equal(snapshot.progress, 0.5);
  assert.equal(snapshot.vehicle.coordinate.lat, -33.412346);
  assert.equal(snapshot.vehicle.speedKph, 38.4);
});

test("tracking-core genera resumen público tipo apoderado", () => {
  const summary = buildGuardianTrackingSummary({
    orderId: "trip-2",
    status: "in_transit",
    currentLocation: "Av. Vitacura",
    etaMin: 4,
    progress: 0.8,
    events: [],
  });

  assert.equal(summary.title, "Llegando al destino");
  assert.equal(summary.etaLabel, "4 min aprox.");
  assert.equal(summary.progressPercent, 80);
});

test("tracking-core genera payload base de marcador", () => {
  const vehicle = buildVehicleLiveSnapshot({
    driverId: "driver-2",
    vehicleId: "VAN-7",
    label: "Van 7",
    coordinate: { lat: -33.44, lng: -70.65 },
    updatedAt: "2026-04-17T11:03:00.000Z",
  });

  const marker = buildVehicleMarkerPayload(vehicle);
  assert.deepEqual(marker.position, [-33.44, -70.65]);
  assert.equal(marker.iconKind, "van");
  assert.match(marker.infoHtml, /VAN-7/);
});
