import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type PodCertificateOrder = {
  trackingCode: string;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  scheduledDate?: string;
  scheduledTime?: string;
};

export type PodCertificatePod = {
  photos: string[];
  recipientName?: string;
  recipientRut?: string;
  notes?: string;
  pickupCondition?: string;
  deliveryCondition?: string;
  deliveredAt?: string;
};

function lineOrDash(value?: string | null) {
  return value && value.trim() ? value : "-";
}

const SANTIAGO_DATE_TIME = new Intl.DateTimeFormat("es-CL", {
  timeZone: "America/Santiago",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatPodDateTime(input?: string) {
  if (!input) return "-";
  const ts = new Date(input).getTime();
  if (!Number.isFinite(ts)) return "-";
  return SANTIAGO_DATE_TIME.format(new Date(ts));
}

export function formatPodScheduledDateTime(date?: string, time?: string) {
  if (!date) return "-";
  const parts = String(date).split("-");
  const hhmm = String(time ?? "").slice(0, 5);
  if (parts.length !== 3) return `${date} ${hhmm}`.trim();
  const [year, month, day] = parts;
  return `${day}/${month}/${year}${hhmm ? ` ${hhmm}` : ""}`;
}

export function buildPodCertificateRows(order: PodCertificateOrder, pod: PodCertificatePod) {
  return [
    ["Cliente", lineOrDash(order.clientName)],
    ["Telefono", lineOrDash(order.clientPhone)],
    ["Email", lineOrDash(order.clientEmail)],
    ["Origen", lineOrDash(order.pickupAddress)],
    ["Destino", lineOrDash(order.deliveryAddress)],
    ["Fecha agendada", formatPodScheduledDateTime(order.scheduledDate, order.scheduledTime)],
    ["Entregado", formatPodDateTime(pod.deliveredAt)],
    ["Recibe", lineOrDash(pod.recipientName)],
    ["RUT receptor", lineOrDash(pod.recipientRut)],
    ["Condicion retiro", lineOrDash(pod.pickupCondition)],
    ["Condicion entrega", lineOrDash(pod.deliveryCondition)],
    ["Evidencias foto", `${pod.photos.length} adjunto(s)`],
  ] as const;
}

export async function generatePodCertificatePdf(order: PodCertificateOrder, pod: PodCertificatePod) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const { width, height } = page.getSize();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const primary = rgb(0.12, 0.23, 0.37);
  const accent = rgb(1, 0.6, 0);
  const text = rgb(0.12, 0.16, 0.22);

  page.drawRectangle({ x: 0, y: height - 84, width, height: 84, color: primary });
  page.drawText("CERTIFICADO POD", {
    x: 36,
    y: height - 48,
    size: 20,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText(`Tracking ${order.trackingCode}`, {
    x: width - 220,
    y: height - 48,
    size: 14,
    font: bold,
    color: accent,
  });

  let y = height - 120;
  const drawRow = (label: string, value: string) => {
    page.drawText(`${label}:`, { x: 36, y, size: 11, font: bold, color: primary });
    page.drawText(value, { x: 190, y, size: 11, font, color: text });
    y -= 22;
  };

  for (const [label, value] of buildPodCertificateRows(order, pod)) {
    drawRow(label, value);
  }

  y -= 8;
  page.drawLine({
    start: { x: 36, y },
    end: { x: width - 36, y },
    thickness: 1,
    color: rgb(0.82, 0.84, 0.88),
  });
  y -= 24;

  page.drawText("Observaciones", { x: 36, y, size: 12, font: bold, color: primary });
  y -= 18;
  page.drawText(lineOrDash(pod.notes).slice(0, 170), { x: 36, y, size: 11, font, color: text });

  y -= 72;
  page.drawText("Firma transportista: ____________________________", {
    x: 36,
    y,
    size: 11,
    font,
    color: text,
  });
  page.drawText("Firma receptor: ________________________________", {
    x: 320,
    y,
    size: 11,
    font,
    color: text,
  });

  page.drawText(`Documento generado automaticamente: ${formatPodDateTime(new Date().toISOString())}`, {
    x: 36,
    y: 28,
    size: 9,
    font,
    color: rgb(0.45, 0.49, 0.56),
  });

  return doc.save();
}
