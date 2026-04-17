import test from "node:test";
import assert from "node:assert/strict";

import {
  findActiveDownloadToken,
  issueDownloadToken,
  normalizeAssetPath,
  normalizeClientEmail,
} from "../.dist/modulos/access/download-token-core/src.js";

test("download-token-core normalizes asset path and email", () => {
  assert.equal(
    normalizeAssetPath("https://host/storage/v1/object/public/zeus-assets/uploads/manual.pdf?x=1"),
    "uploads/manual.pdf",
  );
  assert.equal(normalizeClientEmail(" USER@MAIL.COM "), "user@mail.com");
});

test("download-token-core issues and finds active token", () => {
  const now = new Date("2026-01-01T10:00:00.000Z");
  const record = issueDownloadToken({
    productId: "prod-1",
    clientEmail: "test@mail.com",
    now,
    expiresInMinutes: 30,
  });

  const active = findActiveDownloadToken({
    records: [record],
    productId: "prod-1",
    clientEmail: "test@mail.com",
    now: new Date("2026-01-01T10:10:00.000Z"),
  });

  assert.equal(active?.productId, "prod-1");
  assert.match(record.token, /-/);
});
