export type DemoVisit = {
  prospecto: string;
  visitor_ip?: string;
  user_agent?: string;
  device_fingerprint?: string;
  referrer?: string | null;
  city?: string | null;
  country?: string | null;
  is_team_member: boolean;
  created_at: string;
};

export type BrowserFingerprintSnapshot = {
  userAgent: string;
  language: string;
  screenWidth: number;
  screenHeight: number;
  colorDepth: number;
  timezoneOffset: number;
  hardwareConcurrency?: number | string;
  deviceMemory?: number | string;
};

export function normalizeProspectSlug(slug: string) {
  return String(slug || "").trim().toLowerCase();
}

export function isValidProspectSlug(slug: string): boolean {
  const normalized = normalizeProspectSlug(slug);
  if (!normalized) return false;
  if (normalized.length > 120) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized);
}

export function buildBrowserFingerprintSeed(snapshot: BrowserFingerprintSnapshot) {
  return [
    snapshot.userAgent,
    snapshot.language,
    `${snapshot.screenWidth}x${snapshot.screenHeight}`,
    snapshot.colorDepth,
    snapshot.timezoneOffset,
    snapshot.hardwareConcurrency ?? "unknown",
    snapshot.deviceMemory ?? "unknown",
  ].join("|");
}

export function hashFingerprintSeed(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    const charCode = seed.charCodeAt(index);
    hash = (hash << 5) - hash + charCode;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function createBrowserFingerprint(snapshot: BrowserFingerprintSnapshot) {
  return hashFingerprintSeed(buildBrowserFingerprintSeed(snapshot));
}

export function extractProspectSlugFromPathname(pathname: string) {
  const normalized = String(pathname || "");
  if (!normalized.startsWith("/prospectos/")) return null;
  const prospecto = normalized.split("/prospectos/")[1]?.split("/")[0] ?? "";
  return prospecto ? normalizeProspectSlug(prospecto) : null;
}

export function buildDemoTrackPayload(
  pathname: string,
  options: {
    teamDeviceId?: string | null;
    fingerprint?: string | null;
    referrer?: string | null;
  },
) {
  const prospecto = extractProspectSlugFromPathname(pathname);
  if (!prospecto || !isValidProspectSlug(prospecto)) return null;

  return {
    prospecto,
    device_fingerprint: options.teamDeviceId || options.fingerprint || undefined,
    referrer: options.referrer || null,
  };
}

export function classifyTeamMember(
  options: {
    hasTeamDevice?: boolean;
    teamFingerprintMatch?: boolean;
  },
) {
  return Boolean(options.hasTeamDevice || options.teamFingerprintMatch);
}

export function aggregateVisitCounts(visits: Array<Pick<DemoVisit, "prospecto" | "is_team_member">>) {
  return visits.reduce<Record<string, number>>((accumulator, visit) => {
    if (!visit.prospecto || visit.is_team_member) return accumulator;
    accumulator[visit.prospecto] = (accumulator[visit.prospecto] || 0) + 1;
    return accumulator;
  }, {});
}

export function buildDemoVisitNotificationEmail(
  visit: DemoVisit,
  options?: {
    brandName?: string;
    recipients?: string[];
    baseUrl?: string;
  },
) {
  const brandName = options?.brandName || "Demo Tracker";
  const baseUrl = (options?.baseUrl || "https://hojacero.cl").replace(/\/+$/, "");
  const prospectoName = visit.prospecto.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  return {
    subject: `👀 VISITA AL DEMO: ${prospectoName}`,
    recipients: options?.recipients || [],
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h1 style="color: white; font-size: 24px; margin: 0;">👀 ¡Alguien está viendo el demo!</h1>
        </div>
        <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 15px 0; border: 1px solid #e5e7eb;">
          <h2 style="color: #111; font-size: 20px; margin: 0 0 15px 0;">Demo: ${prospectoName}</h2>
          <p style="margin: 8px 0; color: #444;"><strong>📍 Ubicación:</strong> ${visit.city || "Desconocida"}, ${visit.country || "Desconocido"}</p>
          <p style="margin: 8px 0; color: #444;"><strong>⏰ Hora:</strong> ${visit.created_at}</p>
          <p style="margin: 8px 0; color: #444;"><strong>🔗 Referrer:</strong> ${visit.referrer || "Directo"}</p>
        </div>
        <div style="margin-top: 20px; text-align: center;">
          <a href="${baseUrl}/prospectos/${visit.prospecto}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Ver Demo
          </a>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <p style="font-size: 12px; color: #666;">${brandName}: seguimiento recomendado</p>
        </div>
      </div>
    `,
    text: [
      `Visita al demo: ${prospectoName}`,
      `Ubicación: ${visit.city || "Desconocida"}, ${visit.country || "Desconocido"}`,
      `Hora: ${visit.created_at}`,
      `Referrer: ${visit.referrer || "Directo"}`,
      `Abrir demo: ${baseUrl}/prospectos/${visit.prospecto}`,
    ].join("\n"),
  };
}
