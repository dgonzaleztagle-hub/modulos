export type MapCoordinate = {
  lat: number;
  lng: number;
};

export type MapSurfaceMarker = MapCoordinate & {
  title: string;
  subtitle?: string;
  accentColor?: string;
};

export function buildMapSurfaceConfig(
  center: MapCoordinate,
  options?: {
    zoom?: number;
    style?: string;
    attributionControl?: boolean;
  },
) {
  return {
    style: options?.style || "mapbox://styles/mapbox/dark-v11",
    center: [center.lng, center.lat] as [number, number],
    zoom: options?.zoom ?? 14,
    attributionControl: options?.attributionControl ?? false,
  };
}

export function buildMapFlyToPayload(center: MapCoordinate, zoom = 14) {
  return {
    center: [center.lng, center.lat] as [number, number],
    zoom,
    essential: true,
  };
}

export function normalizeMapMarkers(markers: MapSurfaceMarker[]) {
  return markers.map((marker) => ({
    ...marker,
    title: String(marker.title || "").trim(),
    subtitle: marker.subtitle ? String(marker.subtitle).trim() : "",
    accentColor: marker.accentColor || "#3b82f6",
  }));
}

export function buildMapMarkerPopupHtml(marker: MapSurfaceMarker) {
  const accentColor = marker.accentColor || "#3b82f6";
  return `<div style="color: black; font-family: sans-serif; padding: 5px;">
    <h4 style="margin: 0; font-size: 12px;">${marker.title}</h4>
    ${marker.subtitle ? `<p style="margin: 5px 0 0; font-weight: bold; color: ${accentColor};">${marker.subtitle}</p>` : ""}
  </div>`;
}
