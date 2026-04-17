import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeWalletMessage,
  evaluateWalletDeliveryPolicy,
} from "../.dist/modulos/notifications/wallet-message-core/src.js";

test("wallet-message-core normaliza título y cuerpo", () => {
  const result = normalizeWalletMessage("", "hola", { type: "promocion" });
  assert.equal(result.titulo, "Promo especial para ti");
  assert.match(result.mensaje, /Abre tu tarjeta/);
});

test("wallet-message-core evita duplicados y throttling", () => {
  const now = Date.now();
  const duplicate = evaluateWalletDeliveryPolicy(
    [{ id: `msg-x-${now}`, header: "Hola", body: "Mundo", messageType: "TEXT_AND_NOTIFY" }],
    "Hola",
    "Mundo",
    now,
  );
  assert.equal(duplicate.mode, "silent");

  const throttled = evaluateWalletDeliveryPolicy(
    [1, 2, 3].map((index) => ({
      id: `msg-x-${now - index * 1000}`,
      header: `h${index}`,
      body: `b${index}`,
      messageType: "TEXT_AND_NOTIFY",
    })),
    "Nuevo",
    "Mensaje distinto",
    now,
  );
  assert.equal(throttled.reason, "throttled_24h");
});
