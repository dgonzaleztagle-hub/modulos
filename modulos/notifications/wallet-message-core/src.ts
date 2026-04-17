export type WalletMessageType = "promocion" | "recordatorio" | "cumpleanos" | "beneficio" | "general";

type NormalizeOptions = {
  type?: WalletMessageType;
};

export type NormalizedWalletMessage = {
  titulo: string;
  mensaje: string;
  type: WalletMessageType;
  warnings: string[];
};

export type WalletMessageInfo = {
  id?: string;
  header?: string;
  body?: string;
  messageType?: string;
};

const TITLE_MAX = 45;
const TITLE_MIN = 6;
const BODY_MAX = 140;
const BODY_MIN = 12;
const MAX_NOTIFY_PER_24H = 3;
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const DAY_WINDOW_MS = 24 * 60 * 60 * 1000;

function normalizeSpaces(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function clampText(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 1)).trim()}…`;
}

function getDefaultTitle(type: WalletMessageType) {
  switch (type) {
    case "promocion":
      return "Promo especial para ti";
    case "recordatorio":
      return "Te esperamos hoy";
    case "cumpleanos":
      return "Feliz cumpleaños";
    case "beneficio":
      return "Tienes un beneficio activo";
    default:
      return "Actualización de tu tarjeta";
  }
}

function extractTimestampFromMessageId(id: string | undefined): number | null {
  if (!id) return null;
  const match = id.match(/-(\d{10,13})$/);
  if (!match) return null;
  const raw = Number(match[1]);
  if (!Number.isFinite(raw)) return null;
  return raw < 10_000_000_000 ? raw * 1000 : raw;
}

export function normalizeWalletMessage(
  tituloRaw: string,
  mensajeRaw: string,
  options: NormalizeOptions = {},
): NormalizedWalletMessage {
  const warnings: string[] = [];
  const type = options.type || "general";

  let titulo = normalizeSpaces(tituloRaw || "");
  let mensaje = normalizeSpaces(mensajeRaw || "");

  if (!titulo) {
    titulo = getDefaultTitle(type);
    warnings.push("Título vacío: se aplicó título por defecto.");
  }
  if (!mensaje) {
    mensaje = "Revisa tu tarjeta para ver esta actualización.";
    warnings.push("Mensaje vacío: se aplicó texto por defecto.");
  }

  if (titulo.length < TITLE_MIN) {
    titulo = `${titulo} ahora`;
    warnings.push("Título muy corto: se normalizó para mejor legibilidad.");
  }
  if (mensaje.length < BODY_MIN) {
    mensaje = `${mensaje} Abre tu tarjeta para más detalle.`;
    warnings.push("Mensaje muy corto: se expandió para mayor contexto.");
  }

  if (titulo.length > TITLE_MAX) {
    titulo = clampText(titulo, TITLE_MAX);
    warnings.push(`Título recortado a ${TITLE_MAX} caracteres.`);
  }
  if (mensaje.length > BODY_MAX) {
    mensaje = clampText(mensaje, BODY_MAX);
    warnings.push(`Mensaje recortado a ${BODY_MAX} caracteres.`);
  }

  return { titulo, mensaje, type, warnings };
}

export function evaluateWalletDeliveryPolicy(
  messages: WalletMessageInfo[],
  titulo: string,
  mensaje: string,
  now = Date.now(),
) {
  let notifyCount24h = 0;
  let duplicateRecent = false;

  for (const message of messages) {
    const ts = extractTimestampFromMessageId(message.id);
    if (!ts) continue;
    if (now - ts <= DAY_WINDOW_MS && message.messageType === "TEXT_AND_NOTIFY") {
      notifyCount24h += 1;
    }
    if (message.header === titulo && message.body === mensaje && now - ts <= DUPLICATE_WINDOW_MS) {
      duplicateRecent = true;
    }
  }

  if (duplicateRecent) return { mode: "silent" as const, reason: "duplicate_recent" as const };
  if (notifyCount24h >= MAX_NOTIFY_PER_24H) {
    return { mode: "silent" as const, reason: "throttled_24h" as const };
  }
  return { mode: "notify" as const, reason: "ok" as const };
}
