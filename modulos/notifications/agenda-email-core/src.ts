export interface AgendaEmailEvent {
  id?: string;
  title: string;
  startTime: string;
  source?: string;
  assignedTo?: string | null;
  companyName?: string | null;
  attendeeName?: string | null;
  attendeePhone?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  location?: string | null;
  notes?: string | null;
  description?: string | null;
}

export interface AgendaEmailMessage {
  subject: string;
  html: string;
  text: string;
}

export type AgendaRecipientsMap = Record<string, string[]>;

export const DEFAULT_AGENDA_TEAM_RECIPIENTS: AgendaRecipientsMap = {
  daniel: ["dgonzaleztagle@gmail.com"],
  gaston: ["Gaston.jofre1995@gmail.com"],
  both: ["dgonzaleztagle@gmail.com", "Gaston.jofre1995@gmail.com"],
};

export function resolveAgendaRecipients(
  assignedTo?: string | null,
  recipientsMap: AgendaRecipientsMap = DEFAULT_AGENDA_TEAM_RECIPIENTS,
) {
  return recipientsMap[assignedTo || "both"] || recipientsMap.both || [];
}

export function minutesUntilAgendaEvent(startTime: string, now = new Date()) {
  return Math.round((new Date(startTime).getTime() - now.getTime()) / 60000);
}

export function shouldSendAgendaReminder(
  startTime: string,
  now = new Date(),
  windowStartMinutes = 30,
  windowEndMinutes = 35,
) {
  const minutesUntil = minutesUntilAgendaEvent(startTime, now);
  return minutesUntil >= windowStartMinutes && minutesUntil <= windowEndMinutes;
}

export function buildAgendaReminderEmail(
  event: AgendaEmailEvent,
  options?: { dashboardUrl?: string; now?: Date },
): AgendaEmailMessage {
  const now = options?.now || new Date();
  const dashboardUrl = options?.dashboardUrl || "https://hojacero.cl/dashboard/agenda";
  const startTime = new Date(event.startTime);
  const minutesUntil = minutesUntilAgendaEvent(event.startTime, now);
  const dateStr = startTime.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const timeStr = startTime.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const whatsappLink = event.whatsapp
    ? `https://wa.me/${String(event.whatsapp).replace(/\D/g, "")}`
    : null;
  const websiteUrl = event.website
    ? event.website.startsWith("http")
      ? event.website
      : `https://${event.website}`
    : null;

  const subject = `⏰ RECORDATORIO: ${event.title} en ${minutesUntil} minutos`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <div style="background: linear-gradient(135deg, #0891b2, #06b6d4); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h1 style="color: white; font-size: 24px; margin: 0;">⏰ Reunión en ${minutesUntil} minutos</h1>
      </div>
      <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 15px 0; border: 1px solid #e5e7eb;">
        <h2 style="color: #111; font-size: 20px; margin: 0 0 15px 0;">${escapeHtml(event.title)}</h2>
        <p><strong>📅 Fecha:</strong> ${escapeHtml(dateStr)}</p>
        <p><strong>⏰ Hora:</strong> ${escapeHtml(timeStr)}</p>
        ${event.companyName ? `<p><strong>🏢 Empresa:</strong> ${escapeHtml(event.companyName)}</p>` : ""}
        ${event.attendeeName ? `<p><strong>👤 Cliente:</strong> ${escapeHtml(event.attendeeName)}</p>` : ""}
        ${event.whatsapp && whatsappLink ? `<p><strong>📱 WhatsApp:</strong> <a href="${whatsappLink}" style="color: #0891b2;">${escapeHtml(event.whatsapp)}</a></p>` : ""}
        ${event.website && websiteUrl ? `<p><strong>🌐 Sitio:</strong> <a href="${websiteUrl}" style="color: #0891b2;">${escapeHtml(event.website)}</a></p>` : ""}
        ${event.notes ? `<hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;" /><p style="margin: 0; color: #666; font-style: italic;">"${escapeHtml(event.notes)}"</p>` : ""}
      </div>
      <div style="margin-top: 20px; text-align: center;">
        <a href="${dashboardUrl}" style="display: inline-block; background: #0891b2; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Ver en Dashboard</a>
      </div>
    </div>
  `.trim();

  const text = [
    `RECORDATORIO: ${event.title}`,
    `Faltan ${minutesUntil} minutos.`,
    `Fecha: ${dateStr}`,
    `Hora: ${timeStr}`,
    event.companyName ? `Empresa: ${event.companyName}` : null,
    event.attendeeName ? `Cliente: ${event.attendeeName}` : null,
    event.whatsapp ? `WhatsApp: ${event.whatsapp}` : null,
    event.website ? `Sitio: ${event.website}` : null,
    event.notes ? `Notas: ${event.notes}` : null,
    `Dashboard: ${dashboardUrl}`,
  ].filter(Boolean).join("\n");

  return { subject, html, text };
}

export function buildAgendaCreatedEmail(
  event: AgendaEmailEvent,
  options?: { brandName?: string; dashboardUrl?: string },
): AgendaEmailMessage {
  const startTime = new Date(event.startTime);
  const dashboardUrl = options?.dashboardUrl || "https://hojacero.cl/dashboard/agenda";
  const brandName = options?.brandName || "Hojacero";
  const dateStr = startTime.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  const sourceLabel = event.source === "chat_bot" ? "el bot" : "el dashboard";
  const subject = `🔔 NUEVA REUNIÓN: ${event.title}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h1 style="color: #0891b2; font-size: 24px;">¡Hay una nueva reunión agendada!</h1>
      <p style="color: #444; font-size: 16px;">Se ha registrado un nuevo evento en la agenda desde ${escapeHtml(sourceLabel)}.</p>
      <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #e5e7eb;">
        <p><strong>👤 Cliente:</strong> ${escapeHtml(event.attendeeName || "No especificado")}</p>
        <p><strong>🏢 Empresa:</strong> ${escapeHtml(event.companyName || "No especificada")}</p>
        <p><strong>📱 WhatsApp:</strong> ${escapeHtml(event.whatsapp || event.attendeePhone || "No especificado")}</p>
        <p><strong>🌐 Sitio:</strong> ${escapeHtml(event.website || "No especificado")}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;" />
        <p><strong>📅 Evento:</strong> ${escapeHtml(event.title)}</p>
        <p><strong>⏰ Fecha:</strong> ${escapeHtml(dateStr)}</p>
        ${event.location ? `<p><strong>📍 Lugar:</strong> ${escapeHtml(event.location)}</p>` : ""}
        ${event.description ? `<p style="margin: 15px 0 0 0; color: #666; font-style: italic;">"${escapeHtml(event.description)}"</p>` : ""}
      </div>
      <p style="color: #444; line-height: 1.6;">Revisa los detalles completos en tu dashboard.</p>
      <p><a href="${dashboardUrl}" style="color: #0891b2;">${dashboardUrl}</a></p>
      <p style="font-size: 12px; color: #666;">${escapeHtml(brandName)}</p>
    </div>
  `.trim();

  const text = [
    "NUEVA REUNIÓN",
    `Origen: ${sourceLabel}`,
    `Cliente: ${event.attendeeName || "No especificado"}`,
    `Empresa: ${event.companyName || "No especificada"}`,
    `WhatsApp: ${event.whatsapp || event.attendeePhone || "No especificado"}`,
    `Sitio: ${event.website || "No especificado"}`,
    `Evento: ${event.title}`,
    `Fecha: ${dateStr}`,
    event.location ? `Lugar: ${event.location}` : null,
    event.description ? `Descripción: ${event.description}` : null,
    `Dashboard: ${dashboardUrl}`,
  ].filter(Boolean).join("\n");

  return { subject, html, text };
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
