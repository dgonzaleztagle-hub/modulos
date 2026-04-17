export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface TrackingPoint extends GeoPoint {
  timestamp: string;
}

export type DeliveryOptionId = "express_toll" | "economy_relaxed";
export type RoutePolicy = "prefer_toll_fastest" | "prefer_no_toll";

export interface RoutePlan {
  provider?: "google_routes" | "osrm" | "fallback_haversine";
  expectedDurationMin?: number;
  expectedDistanceKm?: number;
  path?: GeoPoint[];
  policy?: RoutePolicy;
}

export interface RouteAuditPolicy {
  maxAvgDeviationM?: number;
  maxMaxDeviationM?: number;
  maxDurationRatio?: number;
  minDurationRatio?: number;
}

export interface RouteComplianceInput {
  deliveryOption?: DeliveryOptionId;
  routePlan?: RoutePlan | null;
  routeAuditPolicy?: RouteAuditPolicy | null;
  tracking: TrackingPoint[];
}

export interface RouteComplianceResult {
  status: "pass" | "review" | "insufficient_data" | "unavailable";
  expectedTagPolicy: "required_for_express" | "optional_or_avoid";
  inferredTagUsage: "likely" | "unlikely" | "unknown";
  plannedDurationMin: number | null;
  actualDurationMin: number | null;
  durationRatio: number | null;
  trackedDistanceKm: number;
  averageDeviationM: number | null;
  maxDeviationM: number | null;
  reasons: string[];
  thresholds: {
    maxAvgDeviationM: number;
    maxMaxDeviationM: number;
    maxDurationRatio: number;
    minDurationRatio: number;
  };
}

function toNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function resolveThresholds(policy?: RouteAuditPolicy | null) {
  return {
    maxAvgDeviationM: toNumber(policy?.maxAvgDeviationM, 1200),
    maxMaxDeviationM: toNumber(policy?.maxMaxDeviationM, 3000),
    maxDurationRatio: toNumber(policy?.maxDurationRatio, 1.7),
    minDurationRatio: toNumber(policy?.minDurationRatio, 0.45),
  };
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

function haversineKm(from: GeoPoint, to: GeoPoint): number {
  const radiusKm = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function pointToSegmentDistanceKm(point: GeoPoint, start: GeoPoint, end: GeoPoint): number {
  const radiusM = 6371000;
  const lat0 = toRad(point.lat);
  const lng0 = toRad(point.lng);
  const latScale = Math.cos(lat0);

  const toXY = (coord: GeoPoint) => {
    const lat = toRad(coord.lat);
    const lng = toRad(coord.lng);
    return {
      x: (lng - lng0) * latScale * radiusM,
      y: (lat - lat0) * radiusM,
    };
  };

  const p = { x: 0, y: 0 };
  const a = toXY(start);
  const b = toXY(end);
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const abLenSq = abx * abx + aby * aby;

  if (abLenSq <= 0) {
    const dx = p.x - a.x;
    const dy = p.y - a.y;
    return Math.sqrt(dx * dx + dy * dy) / 1000;
  }

  const apx = p.x - a.x;
  const apy = p.y - a.y;
  const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / abLenSq));
  const qx = a.x + t * abx;
  const qy = a.y + t * aby;
  const dx = p.x - qx;
  const dy = p.y - qy;
  return Math.sqrt(dx * dx + dy * dy) / 1000;
}

function minDistanceToPathKm(point: GeoPoint, path: GeoPoint[]): number {
  if (path.length < 2) return Number.POSITIVE_INFINITY;
  let min = Number.POSITIVE_INFINITY;

  for (let index = 1; index < path.length; index += 1) {
    const distance = pointToSegmentDistanceKm(point, path[index - 1], path[index]);
    if (distance < min) min = distance;
  }

  if (!Number.isFinite(min)) {
    for (const pathPoint of path) {
      const distance = haversineKm(point, pathPoint);
      if (distance < min) min = distance;
    }
  }

  return min;
}

export function trackingDistanceKm(tracking: TrackingPoint[]): number {
  if (tracking.length < 2) return 0;
  let total = 0;

  for (let index = 1; index < tracking.length; index += 1) {
    total += haversineKm(tracking[index - 1], tracking[index]);
  }

  return Number(total.toFixed(2));
}

export function evaluateRouteCompliance(input: RouteComplianceInput): RouteComplianceResult {
  const { deliveryOption, routePlan, tracking } = input;
  const thresholds = resolveThresholds(input.routeAuditPolicy);
  const expectedTagPolicy =
    deliveryOption === "express_toll" ? "required_for_express" : "optional_or_avoid";
  const path = routePlan?.path ?? [];

  if (path.length < 2) {
    return {
      status: "unavailable",
      expectedTagPolicy,
      inferredTagUsage: "unknown",
      plannedDurationMin: null,
      actualDurationMin: null,
      durationRatio: null,
      trackedDistanceKm: trackingDistanceKm(tracking),
      averageDeviationM: null,
      maxDeviationM: null,
      reasons: ["No hay ruta recomendada guardada para auditar."],
      thresholds,
    };
  }

  if (tracking.length < 3) {
    return {
      status: "insufficient_data",
      expectedTagPolicy,
      inferredTagUsage: "unknown",
      plannedDurationMin: routePlan?.expectedDurationMin ?? null,
      actualDurationMin: null,
      durationRatio: null,
      trackedDistanceKm: trackingDistanceKm(tracking),
      averageDeviationM: null,
      maxDeviationM: null,
      reasons: ["No hay suficientes puntos de tracking para validar ruta."],
      thresholds,
    };
  }

  const sorted = [...tracking].sort((left, right) => left.timestamp.localeCompare(right.timestamp));
  const firstTs = new Date(sorted[0].timestamp).getTime();
  const lastTs = new Date(sorted[sorted.length - 1].timestamp).getTime();
  const actualDurationMin =
    Number.isFinite(firstTs) && Number.isFinite(lastTs) && lastTs > firstTs
      ? Math.round((lastTs - firstTs) / 60000)
      : null;
  const plannedDurationMin = toNumber(routePlan?.expectedDurationMin, 0) || null;
  const durationRatio =
    plannedDurationMin && actualDurationMin && plannedDurationMin > 0
      ? Number((actualDurationMin / plannedDurationMin).toFixed(2))
      : null;

  const deviationsM = sorted.map((row) => Math.round(minDistanceToPathKm(row, path) * 1000));
  const averageDeviationM =
    deviationsM.length > 0
      ? Math.round(deviationsM.reduce((sum, item) => sum + item, 0) / deviationsM.length)
      : null;
  const maxDeviationM = deviationsM.length > 0 ? Math.max(...deviationsM) : null;
  const trackedDistanceKmValue = trackingDistanceKm(sorted);

  const reasons: string[] = [];
  if (averageDeviationM != null && averageDeviationM > thresholds.maxAvgDeviationM) {
    reasons.push(`Desvio promedio alto (${averageDeviationM}m).`);
  }
  if (maxDeviationM != null && maxDeviationM > thresholds.maxMaxDeviationM) {
    reasons.push(`Desvio maximo alto (${maxDeviationM}m).`);
  }
  if (durationRatio != null && durationRatio > thresholds.maxDurationRatio) {
    reasons.push(`Duracion real muy superior a lo planificado (x${durationRatio}).`);
  }
  if (durationRatio != null && durationRatio < thresholds.minDurationRatio) {
    reasons.push(`Duracion real anormalmente baja (x${durationRatio}).`);
  }

  let inferredTagUsage: RouteComplianceResult["inferredTagUsage"] = "unknown";
  if (durationRatio != null && averageDeviationM != null) {
    if (deliveryOption === "express_toll") {
      inferredTagUsage =
        durationRatio <= 1.35 && averageDeviationM <= thresholds.maxAvgDeviationM
          ? "likely"
          : "unlikely";
    } else {
      inferredTagUsage = durationRatio < 1.15 ? "likely" : "unlikely";
    }
  }

  if (deliveryOption === "express_toll" && inferredTagUsage === "unlikely") {
    reasons.push("Express con TAG sin señales fuertes de ejecucion rapida.");
  }

  return {
    status: reasons.length > 0 ? "review" : "pass",
    expectedTagPolicy,
    inferredTagUsage,
    plannedDurationMin,
    actualDurationMin,
    durationRatio,
    trackedDistanceKm: trackedDistanceKmValue,
    averageDeviationM,
    maxDeviationM,
    reasons,
    thresholds,
  };
}
