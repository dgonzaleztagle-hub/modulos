export type EmailMessage = {
  subject: string;
  html: string;
  text: string;
};

export type ReservationConfirmationParams = {
  to: string;
  customerName: string;
  reservationNumber: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  brandName?: string;
  accentColor?: string;
  backgroundColor?: string;
};

export type NewsletterWelcomeParams = {
  to: string;
  firstName?: string | null;
  brandName?: string;
  circleName?: string;
  menuUrl?: string;
  accentColor?: string;
  backgroundColor?: string;
};

function escapeHtml(value: string) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function baseColors(options?: { accentColor?: string; backgroundColor?: string }) {
  return {
    accent: options?.accentColor || "#c9952a",
    background: options?.backgroundColor || "#faf7f0",
    text: "#1a1209",
    muted: "#6b5240",
    border: "#e4d8d1",
    cta: "#91226f",
  };
}

export function buildReservationConfirmationEmail(
  params: ReservationConfirmationParams,
): EmailMessage {
  const colors = baseColors(params);
  const brandName = params.brandName || "Reserva";
  const customerName = escapeHtml(params.customerName);
  const reservationNumber = escapeHtml(params.reservationNumber);
  const reservationDate = escapeHtml(params.reservationDate);
  const reservationTime = escapeHtml(params.reservationTime);

  return {
    subject: `Reserva confirmada #${reservationNumber} · ${brandName}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: ${colors.background};">
        <h1 style="font-style: italic; font-weight: 400; color: ${colors.text}; margin-bottom: 8px;">¡Reserva confirmada!</h1>
        <p style="color: ${colors.muted}; font-size: 14px;">Hola ${customerName}, tu mesa está reservada.</p>
        <div style="background: white; border: 1px solid ${colors.border}; padding: 24px; margin: 24px 0;">
          <table style="width: 100%; font-size: 14px;">
            <tr><td style="color: ${colors.muted}; padding: 4px 0;">Reserva</td><td style="color: ${colors.text}; font-weight: 500; text-align: right;">#${reservationNumber}</td></tr>
            <tr><td style="color: ${colors.muted}; padding: 4px 0;">Fecha</td><td style="color: ${colors.text}; font-weight: 500; text-align: right;">${reservationDate}</td></tr>
            <tr><td style="color: ${colors.muted}; padding: 4px 0;">Hora</td><td style="color: ${colors.text}; font-weight: 500; text-align: right;">${reservationTime} hrs</td></tr>
            <tr><td style="color: ${colors.muted}; padding: 4px 0;">Personas</td><td style="color: ${colors.text}; font-weight: 500; text-align: right;">${params.partySize}</td></tr>
          </table>
        </div>
        <p style="color: ${colors.muted}; font-size: 13px;">
          Si necesitas modificar tu reserva, contáctanos con anticipación.
          <br/>¡Te esperamos!
        </p>
        <p style="color: ${colors.accent}; font-style: italic; font-size: 18px; margin-top: 32px;">${escapeHtml(brandName)}</p>
      </div>
    `,
    text: [
      "¡Reserva confirmada!",
      `Hola ${params.customerName}, tu mesa está reservada.`,
      `Reserva: #${params.reservationNumber}`,
      `Fecha: ${params.reservationDate}`,
      `Hora: ${params.reservationTime} hrs`,
      `Personas: ${params.partySize}`,
      `Marca: ${brandName}`,
    ].join("\n"),
  };
}

export function buildNewsletterWelcomeEmail(
  params: NewsletterWelcomeParams,
): EmailMessage {
  const colors = baseColors(params);
  const brandName = params.brandName || "Marca";
  const circleName = params.circleName || `${brandName} Circle`;
  const firstName = params.firstName ? `, ${escapeHtml(params.firstName)}` : "";
  const menuUrl = params.menuUrl || "https://example.com/menu";

  return {
    subject: `Bienvenido/a al círculo ${brandName}${params.firstName ? `, ${params.firstName}` : ""}!`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: ${colors.background};">
        <p style="color: ${colors.accent}; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;">${escapeHtml(circleName)}</p>
        <h1 style="font-style: italic; font-weight: 300; color: ${colors.text}; font-size: 32px; margin: 8px 0 16px;">
          ¡Bienvenido/a${firstName}!
        </h1>
        <p style="color: ${colors.muted}; font-size: 15px; line-height: 1.7;">
          Ya eres parte del círculo ${escapeHtml(brandName)}. Pronto recibirás promociones exclusivas,
          adelantos y beneficios especiales.
        </p>
        <div style="margin: 32px 0; background: white; border: 1px solid ${colors.border}; padding: 20px;">
          <p style="color: ${colors.text}; font-size: 14px; margin: 0;">
            Recuerda que puedes comprar o reservar directamente desde nuestro sitio con la mejor experiencia posible.
          </p>
        </div>
        <a href="${escapeHtml(menuUrl)}"
          style="display: inline-block; background: ${colors.cta}; color: white; padding: 14px 32px;
          text-decoration: none; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;">
          Ver menú →
        </a>
        <p style="color: ${colors.accent}; font-style: italic; font-size: 24px; margin-top: 40px;">${escapeHtml(brandName)}</p>
      </div>
    `,
    text: [
      `¡Bienvenido/a${params.firstName ? `, ${params.firstName}` : ""}!`,
      `Ya eres parte del círculo ${circleName}.`,
      "Pronto recibirás promociones exclusivas y beneficios especiales.",
      `Ver menú: ${menuUrl}`,
    ].join("\n"),
  };
}
