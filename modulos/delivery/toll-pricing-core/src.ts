export type TariffTier = "baja" | "media" | "alta";

export type TollPortalLite = {
  portico_uid: string;
  coordenadas?: { lat: number; lng: number };
  tarifas?: Record<string, number>;
  horarios?: Record<string, unknown>;
};

type TimeWindows = {
  baja?: string[];
  media?: string[];
  alta?: string[];
};

function toMinutes(hhmm: string): number | null {
  if (!/^\d{2}:\d{2}$/.test(hhmm)) return null;
  const h = Number(hhmm.slice(0, 2));
  const m = Number(hhmm.slice(3, 5));
  if (!Number.isInteger(h) || !Number.isInteger(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

function inRange(targetMin: number, range: string): boolean {
  const [start, end] = range.split("-");
  const startMin = toMinutes(start);
  const endMin = toMinutes(end);
  if (startMin == null || endMin == null) return false;
  return targetMin >= startMin && targetMin <= endMin;
}

function getDayNameEs(dateIso?: string): string {
  const date = dateIso ? new Date(dateIso) : new Date();
  const day = Number.isNaN(date.getTime()) ? new Date().getDay() : date.getDay();
  return ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"][day];
}

function getWindowsForDay(portal: TollPortalLite, dayNameEs: string): TimeWindows {
  const horarios = (portal.horarios ?? {}) as Record<string, unknown>;
  const weekdays = (horarios["dias_habiles"] as { dias_aplica?: string[] } | undefined)?.dias_aplica ?? [];
  const weekend =
    (horarios["fines_semana_festivos"] as { dias_aplica?: string[] } | undefined)?.dias_aplica ?? [];

  if (weekend.includes(dayNameEs)) {
    return ((horarios["fines_semana_festivos"] as { tramos?: TimeWindows } | undefined)?.tramos ?? {});
  }
  if (weekdays.includes(dayNameEs)) {
    return ((horarios["dias_habiles"] as { tramos?: TimeWindows } | undefined)?.tramos ?? {});
  }
  return ((horarios["dias_habiles"] as { tramos?: TimeWindows } | undefined)?.tramos ?? {});
}

export function resolveTariffTier(
  portal: TollPortalLite,
  scheduledDate?: string,
  scheduledTime?: string,
): TariffTier {
  if (!scheduledTime) return "media";
  const hhmm = scheduledTime.slice(0, 5);
  const targetMin = toMinutes(hhmm);
  if (targetMin == null) return "media";

  const dayName = getDayNameEs(scheduledDate);
  const windows = getWindowsForDay(portal, dayName);
  const order: TariffTier[] = ["alta", "media", "baja"];

  for (const tier of order) {
    const ranges = windows[tier] ?? [];
    if (ranges.some((range) => inRange(targetMin, range))) return tier;
  }

  return "media";
}

function asNumber(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function clamp01(value: number) {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function pointToSegmentDistanceKm(
  point: { lat: number; lng: number },
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const lat0 = toRad((a.lat + b.lat + point.lat) / 3);
  const x = (lng: number) => toRad(lng) * Math.cos(lat0) * 6371;
  const y = (lat: number) => toRad(lat) * 6371;

  const px = x(point.lng);
  const py = y(point.lat);
  const ax = x(a.lng);
  const ay = y(a.lat);
  const bx = x(b.lng);
  const by = y(b.lat);

  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const ab2 = abx * abx + aby * aby;
  if (ab2 === 0) return Math.hypot(px - ax, py - ay);

  const t = clamp01((apx * abx + apy * aby) / ab2);
  const cx = ax + t * abx;
  const cy = ay + t * aby;
  return Math.hypot(px - cx, py - cy);
}

function minDistanceToPathKm(point: { lat: number; lng: number }, path: Array<{ lat: number; lng: number }>) {
  if (path.length < 2) return Number.POSITIVE_INFINITY;
  let min = Number.POSITIVE_INFINITY;
  for (let index = 1; index < path.length; index += 1) {
    const distance = pointToSegmentDistanceKm(point, path[index - 1], path[index]);
    if (distance < min) min = distance;
  }
  return min;
}

export function estimateTollFromCatalog(input: {
  portals: TollPortalLite[];
  routePath: Array<{ lat: number; lng: number }>;
  scheduledDate?: string;
  scheduledTime?: string;
  matchToleranceM?: number;
}) {
  const { portals, routePath, scheduledDate, scheduledTime, matchToleranceM } = input;
  if (!portals.length || routePath.length < 2) return null;

  const thresholdKm = Math.max(50, Number(matchToleranceM ?? 250)) / 1000;
  const matched = portals
    .map((portal) => {
      const coords = portal.coordenadas;
      if (!coords) return null;
      const tier = resolveTariffTier(portal, scheduledDate, scheduledTime);
      const tariff = asNumber(portal.tarifas?.[tier]);
      if (tariff <= 0) return null;
      const distanceToPathKm = minDistanceToPathKm(coords, routePath);
      if (!Number.isFinite(distanceToPathKm) || distanceToPathKm > thresholdKm) return null;
      return { uid: portal.portico_uid, tariff };
    })
    .filter((item): item is { uid: string; tariff: number } => Boolean(item));

  if (!matched.length) return null;

  const uniqueByUid = new Map<string, number>();
  for (const item of matched) {
    if (!uniqueByUid.has(item.uid)) uniqueByUid.set(item.uid, item.tariff);
  }

  const selectedTariffs = [...uniqueByUid.values()];
  const avgPortalTariff = selectedTariffs.reduce((sum, value) => sum + value, 0) / selectedTariffs.length;
  const tollEstimate = Math.round(selectedTariffs.reduce((sum, value) => sum + value, 0));

  return {
    tollEstimate: Math.max(0, tollEstimate),
    basis: "path_catalog" as const,
    avgPortalTariff: Math.round(avgPortalTariff),
    estimatedPortalCount: selectedTariffs.length,
    matchedPortalUids: [...uniqueByUid.keys()],
  };
}
