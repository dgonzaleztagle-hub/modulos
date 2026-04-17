import test from "node:test";
import assert from "node:assert/strict";
import {
  buildPodCertificateRows,
  formatPodScheduledDateTime,
  generatePodCertificatePdf,
} from "../.dist/modulos/pdf/pod-certificate-core/src.js";

test("pod-certificate-core arma filas y agenda", async () => {
  assert.equal(formatPodScheduledDateTime("2026-04-16", "10:30"), "16/04/2026 10:30");

  const rows = buildPodCertificateRows(
    {
      trackingCode: "AC-001",
      clientName: "Cliente",
      pickupAddress: "Origen",
      deliveryAddress: "Destino",
      scheduledDate: "2026-04-16",
      scheduledTime: "10:30",
    },
    {
      photos: ["a.jpg"],
      deliveredAt: "2026-04-16T14:00:00Z",
      recipientName: "Recepción",
    },
  );

  assert.equal(rows[0][0], "Cliente");
  assert.equal(rows.at(-1)?.[1], "1 adjunto(s)");

  const pdf = await generatePodCertificatePdf(
    {
      trackingCode: "AC-001",
      clientName: "Cliente",
      pickupAddress: "Origen",
      deliveryAddress: "Destino",
      scheduledDate: "2026-04-16",
      scheduledTime: "10:30",
    },
    {
      photos: ["a.jpg"],
      deliveredAt: "2026-04-16T14:00:00Z",
      recipientName: "Recepción",
      notes: "Entrega completa",
    },
  );

  assert.ok(pdf.length > 500);
});
