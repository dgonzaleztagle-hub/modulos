import test from "node:test";
import assert from "node:assert/strict";

import {
  buildWhatsAppLink,
  formatPhoneForWhatsApp,
  templateCobranza,
} from "../.dist/modulos/notifications/whatsapp-template-kit/src.js";

test("whatsapp-template-kit normalizes Chile mobile numbers", () => {
  assert.equal(formatPhoneForWhatsApp("9 8765 4321"), "56987654321");
});

test("whatsapp-template-kit builds wa link and cobranza template", () => {
  const message = templateCobranza({
    clientName: "Ana",
    propertyName: "Depto Centro",
    amount: "$500.000",
    daysOverdue: 8,
  });
  const link = buildWhatsAppLink("987654321", message);
  assert.match(link, /^https:\/\/wa\.me\/56987654321\?text=/);
  assert.match(message, /Ana/);
});
