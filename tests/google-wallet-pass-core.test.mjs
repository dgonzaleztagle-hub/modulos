import test from "node:test";
import assert from "node:assert/strict";

import {
  buildGoogleWalletClass,
  buildGoogleWalletObject,
  buildWalletObjectCandidates,
  getWalletProgramLabel,
  validateGoogleWalletPrivateKeyFormat,
} from "../.dist/modulos/integrations/google-wallet-pass-core/src.js";

test("google-wallet-pass-core resuelve labels y candidatos", () => {
  assert.equal(getWalletProgramLabel("cashback"), "Cashback $");
  assert.deepEqual(
    buildWalletObjectCandidates({ issuerId: "issuer", tenantSlug: "demo", customerId: "1", whatsapp: "+56911111111" }),
    ["issuer.vuelve-demo-1", "issuer.vuelve-demo-+56911111111"],
  );
});

test("google-wallet-pass-core arma object y class payloads", () => {
  const objectPayload = buildGoogleWalletObject({
    issuerId: "issuer",
    classId: "class-a",
    objectId: "obj-a",
    merchantName: "Barber Demo",
    userName: "Ana",
    points: 7,
    customerWhatsapp: "+56911111111",
    tenantSlug: "barber-demo",
    lat: -33.45,
    lng: -70.66,
    geoMessage: "Estas cerca de tu premio",
  });
  const classPayload = buildGoogleWalletClass({
    issuerId: "issuer",
    classId: "class-a",
    programName: "Barber Demo",
    hexBackgroundColor: "#111111",
  });

  assert.equal(objectPayload.id, "issuer.obj-a");
  assert.equal(classPayload.id, "issuer.class-a");
  assert.equal(classPayload.hexBackgroundColor, "#111111");
});

test("google-wallet-pass-core valida formato PEM", () => {
  assert.equal(validateGoogleWalletPrivateKeyFormat("-----BEGIN PRIVATE KEY-----abc-----END PRIVATE KEY-----"), true);
  assert.equal(validateGoogleWalletPrivateKeyFormat("abc"), false);
});
