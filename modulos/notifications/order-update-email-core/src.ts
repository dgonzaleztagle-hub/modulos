export type NotificationRecipientType = "client" | "driver" | "admin";

export type OrderEmailStatus =
  | "pending"
  | "assigned"
  | "accepted"
  | "arrived_pickup"
  | "picked_up"
  | "in_transit"
  | "arrived_delivery"
  | "completed"
  | "failed_delivery"
  | "cancelled"
  | string;

export type OrderEmailNotificationType =
  | "order_created"
  | "order_assigned"
  | "driver_on_route"
  | "driver_near"
  | "order_completed"
  | "incident_reported"
  | "driver_onboarded"
  | string;

export type OrderEmailInput = {
  trackingCode: string;
  status: OrderEmailStatus;
  createdAt: string;
  scheduledDate?: string;
  scheduledTime?: string;
  pickupAddress: string;
  deliveryAddress: string;
  totalPrice: number;
};

export type NotificationEmail = {
  subject: string;
  html: string;
  text: string;
};

type EmailSupportOptions = {
  supportPhone?: string;
  supportWaLink?: string;
  baseUrl?: string;
};

function statusLabel(status: OrderEmailStatus): string {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "assigned":
      return "Asignado";
    case "accepted":
      return "Aceptado";
    case "arrived_pickup":
      return "En origen";
    case "picked_up":
      return "Retirado";
    case "in_transit":
      return "En ruta";
    case "arrived_delivery":
      return "Llegando";
    case "completed":
      return "Completado";
    case "failed_delivery":
      return "Entrega fallida";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
}

function typeTitle(kind: OrderEmailNotificationType): string {
  switch (kind) {
    case "order_created":
      return "Servicio confirmado";
    case "order_assigned":
      return "Servicio asignado";
    case "driver_on_route":
      return "Conductor en ruta";
    case "driver_near":
      return "Conductor llegando";
    case "order_completed":
      return "Servicio completado";
    case "incident_reported":
      return "Incidencia reportada";
    case "driver_onboarded":
      return "Acceso habilitado";
    default:
      return "Actualizacion de servicio";
  }
}

function formatClp(value: number): string {
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `$${Math.round(value)}`;
  }
}

function formatSantiagoDateTime(input?: string): string {
  if (!input) return "-";
  const ts = new Date(input).getTime();
  if (!Number.isFinite(ts)) return "-";
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(ts));
}

function formatScheduledDateTime(date?: string, time?: string): string {
  if (!date) return "-";
  const parts = String(date).split("-");
  const hhmm = String(time ?? "").slice(0, 5);
  if (parts.length !== 3) return `${date} ${hhmm}`.trim();
  const [year, month, day] = parts;
  return `${day}/${month}/${year}${hhmm ? ` ${hhmm}` : ""}`;
}

export function buildOrderUpdateEmail(
  order: OrderEmailInput,
  recipientType: NotificationRecipientType,
  notificationType: OrderEmailNotificationType,
  message: string,
  support?: EmailSupportOptions,
): NotificationEmail {
  const title = typeTitle(notificationType);
  const subject = `Servicio | ${title} | ${order.trackingCode}`;
  const baseUrl = (support?.baseUrl || "https://acargoo.cl").replace(/\/+$/, "");
  const trackingUrl = `${baseUrl}/aplicaciones/acargoo/track/${encodeURIComponent(order.trackingCode)}`;
  const supportPhone = String(support?.supportPhone ?? "").replace(/\D/g, "");
  const supportWaLink =
    support?.supportWaLink ??
    (supportPhone
      ? `https://wa.me/${supportPhone}?text=${encodeURIComponent("Hola, necesito ayuda con mi servicio.")}`
      : "");

  const supportLine =
    supportPhone || supportWaLink
      ? `<p style="margin:12px 0 0 0;font-size:13px;color:#334155">Ayuda rápida: ${
          supportWaLink ? `<a href="${supportWaLink}" style="color:#0f766e;font-weight:700;text-decoration:none">WhatsApp</a>` : ""
        }${supportWaLink && supportPhone ? " · " : ""}${
          supportPhone ? `<a href="tel:+${supportPhone}" style="color:#0f766e;font-weight:700;text-decoration:none">Llamar</a>` : ""
        }</p>`
      : "";

  const cta =
    recipientType === "client"
      ? `<a href="${trackingUrl}" style="display:inline-block;padding:12px 18px;background:#0f766e;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700">Ver seguimiento</a>`
      : "";

  const html = `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:24px 0">
      <tr>
        <td align="center">
          <table role="presentation" width="620" cellspacing="0" cellpadding="0" style="max-width:620px;width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
            <tr>
              <td style="background:#0f172a;color:#ffffff;padding:18px 24px;font-size:20px;font-weight:700">Servicio</td>
            </tr>
            <tr>
              <td style="padding:24px">
                <h1 style="margin:0 0 10px 0;font-size:22px;line-height:1.3">${title}</h1>
                <p style="margin:0 0 16px 0;font-size:15px;line-height:1.5">${message}</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:10px 0 18px 0;border-collapse:collapse">
                  <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Codigo</td><td style="padding:8px 0;font-weight:700">${order.trackingCode}</td></tr>
                  <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Estado</td><td style="padding:8px 0">${statusLabel(order.status)}</td></tr>
                  <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Apertura solicitud</td><td style="padding:8px 0">${formatSantiagoDateTime(order.createdAt)}</td></tr>
                  <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Agendamiento</td><td style="padding:8px 0">${formatScheduledDateTime(order.scheduledDate, order.scheduledTime)}</td></tr>
                  <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Origen</td><td style="padding:8px 0">${order.pickupAddress}</td></tr>
                  <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Destino</td><td style="padding:8px 0">${order.deliveryAddress}</td></tr>
                  <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Monto</td><td style="padding:8px 0">${formatClp(order.totalPrice)}</td></tr>
                </table>
                ${cta}
                ${supportLine}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const textLines = [
    `Servicio - ${title}`,
    message,
    `Codigo: ${order.trackingCode}`,
    `Estado: ${statusLabel(order.status)}`,
    `Apertura solicitud: ${formatSantiagoDateTime(order.createdAt)}`,
    `Agendamiento: ${formatScheduledDateTime(order.scheduledDate, order.scheduledTime)}`,
    `Origen: ${order.pickupAddress}`,
    `Destino: ${order.deliveryAddress}`,
    `Monto: ${formatClp(order.totalPrice)}`,
    recipientType === "client" ? `Seguimiento: ${trackingUrl}` : "",
    supportWaLink ? `WhatsApp ayuda: ${supportWaLink}` : "",
    supportPhone ? `Teléfono ayuda: +${supportPhone}` : "",
  ].filter(Boolean);

  return {
    subject,
    html,
    text: textLines.join("\n"),
  };
}
