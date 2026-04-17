export interface TrackingEvent {
  type: string;
  label: string;
  timestamp: string;
  location?: string;
  metadata?: Record<string, unknown>;
}

export interface TrackingCoordinate {
  lat: number;
  lng: number;
}

export interface TrackingStop {
  id: string;
  label: string;
  status?: "pending" | "arrived" | "completed" | "skipped";
  order?: number;
  coordinate?: TrackingCoordinate;
}

export interface VehicleLiveSnapshot {
  driverId: string;
  vehicleId?: string;
  label: string;
  coordinate: TrackingCoordinate;
  headingDeg?: number;
  speedKph?: number;
  updatedAt: string;
  online?: boolean;
}

export interface TrackingSnapshot {
  orderId: string;
  status: string;
  events: TrackingEvent[];
  currentLocation?: string;
  vehicle?: VehicleLiveSnapshot;
  plannedStops?: TrackingStop[];
  completedStopIds?: string[];
  etaMin?: number | null;
  progress?: number;
}

export function sortTrackingEvents(events: TrackingEvent[]): TrackingEvent[] {
  return [...events].sort(
    (left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime(),
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function normalizeCoordinate(input: TrackingCoordinate): TrackingCoordinate {
  return {
    lat: Number(input.lat.toFixed(6)),
    lng: Number(input.lng.toFixed(6)),
  };
}

export function buildVehicleLiveSnapshot(input: VehicleLiveSnapshot): VehicleLiveSnapshot {
  return {
    ...input,
    label: String(input.label || "").trim(),
    coordinate: normalizeCoordinate(input.coordinate),
    headingDeg:
      input.headingDeg == null
        ? undefined
        : Number(clamp(input.headingDeg, 0, 360).toFixed(1)),
    speedKph:
      input.speedKph == null
        ? undefined
        : Number(Math.max(0, input.speedKph).toFixed(1)),
    online: input.online ?? true,
  };
}

export function calculateStopProgress(
  stops: TrackingStop[] = [],
  completedStopIds: string[] = [],
): number {
  if (stops.length === 0) return 0;
  const completed = new Set(completedStopIds);
  const doneCount = stops.filter((stop) => {
    const explicitDone = stop.status === "completed" || stop.status === "arrived";
    return explicitDone || completed.has(stop.id);
  }).length;
  return Number((doneCount / stops.length).toFixed(2));
}

export function normalizeTrackingStops(stops: TrackingStop[] = []): TrackingStop[] {
  return [...stops]
    .map((stop, index) => ({
      ...stop,
      label: String(stop.label || "").trim(),
      order: stop.order ?? index + 1,
      coordinate: stop.coordinate ? normalizeCoordinate(stop.coordinate) : undefined,
      status: stop.status ?? "pending",
    }))
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
}

export function buildTrackingSnapshot(input: TrackingSnapshot): TrackingSnapshot {
  const events = sortTrackingEvents(input.events);
  const plannedStops = normalizeTrackingStops(input.plannedStops);
  const completedStopIds = [...new Set(input.completedStopIds ?? [])];
  const progress = input.progress ?? calculateStopProgress(plannedStops, completedStopIds);
  return {
    ...input,
    events,
    currentLocation: input.currentLocation ?? events[events.length - 1]?.location,
    vehicle: input.vehicle ? buildVehicleLiveSnapshot(input.vehicle) : undefined,
    plannedStops,
    completedStopIds,
    etaMin: input.etaMin ?? null,
    progress,
  };
}

export function getLatestTrackingEvent(events: TrackingEvent[]): TrackingEvent | undefined {
  return sortTrackingEvents(events).at(-1);
}

export function buildTrackingStatusLabel(snapshot: TrackingSnapshot): string {
  const progress = snapshot.progress ?? 0;
  if (snapshot.status === "completed") return "Recorrido completado";
  if (snapshot.status === "cancelled") return "Recorrido cancelado";
  if (snapshot.status === "in_transit" && progress >= 0.75) return "Llegando al destino";
  if (snapshot.status === "in_transit") return "En ruta";
  if (snapshot.status === "picked_up") return "Abordo";
  if (snapshot.status === "assigned") return "Vehículo asignado";
  return "Pendiente";
}

export function buildGuardianTrackingSummary(snapshot: TrackingSnapshot): {
  title: string;
  subtitle: string;
  etaLabel: string;
  progressPercent: number;
} {
  const progressPercent = Math.round((snapshot.progress ?? 0) * 100);
  const etaLabel =
    snapshot.etaMin == null
      ? "ETA no disponible"
      : snapshot.etaMin <= 1
        ? "Llega ahora"
        : `${snapshot.etaMin} min aprox.`;

  return {
    title: buildTrackingStatusLabel(snapshot),
    subtitle: snapshot.currentLocation ?? snapshot.vehicle?.label ?? "Ubicación en actualización",
    etaLabel,
    progressPercent,
  };
}

export function buildVehicleMarkerPayload(snapshot: VehicleLiveSnapshot) {
  return {
    id: snapshot.driverId,
    position: [snapshot.coordinate.lat, snapshot.coordinate.lng] as [number, number],
    label: snapshot.label,
    title: snapshot.vehicleId ? `${snapshot.label} · ${snapshot.vehicleId}` : snapshot.label,
    iconKind: "van" as const,
    iconSizePx: 34,
    fillColor: snapshot.online ? "#f97316" : "#94a3b8",
    strokeColor: "#0f172a",
    infoHtml: `<div style="padding:6px 8px;font-family:system-ui,sans-serif;">
      <strong>${snapshot.label}</strong><br/>
      ${snapshot.vehicleId ? `Vehículo: ${snapshot.vehicleId}<br/>` : ""}
      ${snapshot.speedKph != null ? `Velocidad: ${snapshot.speedKph} km/h<br/>` : ""}
      Actualizado: ${snapshot.updatedAt}
    </div>`,
  };
}

export function generateSimpleFingerprint(parts: Array<string | number | undefined | null>): string {
  const data = parts.map((value) => String(value ?? "")).join("|");
  let hash = 0;
  for (let index = 0; index < data.length; index += 1) {
    hash = ((hash << 5) - hash) + data.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
