import test from "node:test";
import assert from "node:assert/strict";
import {
  isValidProspectSlug,
  createBrowserFingerprint,
  buildDemoTrackPayload,
  aggregateVisitCounts,
  buildDemoVisitNotificationEmail,
} from "../.dist/modulos/crm/demo-tracking-core/src.js";

test("demo-tracking-core valida slugs y arma fingerprint", () => {
  assert.equal(isValidProspectSlug("demo-foodtruck"), true);
  assert.equal(isValidProspectSlug("Demo Invalido"), false);

  const fingerprint = createBrowserFingerprint({
    userAgent: "UA",
    language: "es-CL",
    screenWidth: 1440,
    screenHeight: 900,
    colorDepth: 24,
    timezoneOffset: 180,
    hardwareConcurrency: 8,
    deviceMemory: 16,
  });

  assert.equal(typeof fingerprint, "string");
  assert.ok(fingerprint.length > 0);
});

test("demo-tracking-core arma payload y agrega conteos", () => {
  const payload = buildDemoTrackPayload("/prospectos/donde-germain", {
    teamDeviceId: "team-1",
    referrer: "https://google.com",
  });

  assert.equal(payload.prospecto, "donde-germain");
  assert.equal(payload.device_fingerprint, "team-1");

  const counts = aggregateVisitCounts([
    { prospecto: "donde-germain", is_team_member: false },
    { prospecto: "donde-germain", is_team_member: true },
    { prospecto: "rishtedar", is_team_member: false },
  ]);

  assert.deepEqual(counts, { "donde-germain": 1, rishtedar: 1 });
});

test("demo-tracking-core arma email de visita", () => {
  const email = buildDemoVisitNotificationEmail({
    prospecto: "donde-germain",
    city: "Santiago",
    country: "Chile",
    referrer: "Directo",
    is_team_member: false,
    created_at: "2026-04-16T18:00:00Z",
  }, { baseUrl: "https://hojacero.cl" });

  assert.match(email.subject, /VISITA AL DEMO/);
  assert.match(email.html, /donde-germain/);
  assert.match(email.text, /Santiago/);
});
