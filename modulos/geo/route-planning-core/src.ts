export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface GeocodedPoint extends GeoPoint {
  displayName?: string;
}

export interface RoutePlan {
  distanceKm: number;
  durationMin: number;
  provider: "google_routes" | "osrm" | "fallback_haversine";
  path: GeoPoint[];
}

export interface PortableFetchResponse {
  ok: boolean;
  json(): Promise<unknown>;
}

export type PortableFetcher = (
  url: string,
  init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    cache?: string;
  },
) => Promise<PortableFetchResponse>;

const DEFAULT_HEADERS = {
  "User-Agent": "modulos-route-planning/1.0",
  Accept: "application/json",
};

export function normalizeAddress(address: string): string {
  return address.replace(/\s+/g, " ").trim();
}

export function parseGoogleDurationSeconds(raw?: string): number | null {
  if (!raw) return null;
  const cleaned = raw.trim();
  if (!cleaned.endsWith("s")) return null;
  const seconds = Number(cleaned.slice(0, -1));
  return Number.isFinite(seconds) ? seconds : null;
}

export function buildGoogleGeocodeUrl(address: string, apiKey: string): string {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", normalizeAddress(address));
  url.searchParams.set("region", "cl");
  url.searchParams.set("key", apiKey);
  return url.toString();
}

export function buildNominatimGeocodeUrl(address: string): string {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", normalizeAddress(address));
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "cl");
  return url.toString();
}

export function buildOsrmRouteUrl(origin: GeoPoint, destination: GeoPoint): string {
  const url = new URL(
    `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`,
  );
  url.searchParams.set("overview", "simplified");
  url.searchParams.set("geometries", "geojson");
  url.searchParams.set("alternatives", "false");
  url.searchParams.set("steps", "false");
  return url.toString();
}

export function buildGoogleRoutesRequest(origin: GeoPoint, destination: GeoPoint, apiKey: string) {
  return {
    url: "https://routes.googleapis.com/directions/v2:computeRoutes",
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
      },
      body: JSON.stringify({
        origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
        destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        computeAlternativeRoutes: false,
        languageCode: "es-CL",
        units: "METRIC",
      }),
      cache: "no-store",
    },
  };
}

export function haversineKm(origin: GeoPoint, destination: GeoPoint): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latDelta = toRad(destination.lat - origin.lat);
  const lngDelta = toRad(destination.lng - origin.lng);
  const lat1 = toRad(origin.lat);
  const lat2 = toRad(destination.lat);
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.sin(lngDelta / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function interpolatePath(origin: GeoPoint, destination: GeoPoint, segments = 12): GeoPoint[] {
  const points: GeoPoint[] = [];
  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    points.push({
      lat: Number((origin.lat + (destination.lat - origin.lat) * t).toFixed(6)),
      lng: Number((origin.lng + (destination.lng - origin.lng) * t).toFixed(6)),
    });
  }
  return points;
}

export function decodeGooglePolyline(encoded: string): GeoPoint[] {
  const points: GeoPoint[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20 && index < encoded.length);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20 && index < encoded.length);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push({
      lat: Number((lat / 1e5).toFixed(6)),
      lng: Number((lng / 1e5).toFixed(6)),
    });
  }

  return points;
}

export function estimateFallbackRoute(origin: GeoPoint, destination: GeoPoint): RoutePlan {
  const straightKm = haversineKm(origin, destination);
  const roadApproxKm = straightKm * 1.22;
  const durationMin = Math.max(5, Math.round((roadApproxKm / 35) * 60));
  return {
    distanceKm: Number(roadApproxKm.toFixed(2)),
    durationMin,
    provider: "fallback_haversine",
    path: interpolatePath(origin, destination),
  };
}

export async function geocodeAddressPortable(
  address: string,
  options: { fetcher?: PortableFetcher; googleApiKey?: string } = {},
): Promise<GeocodedPoint | null> {
  const normalized = normalizeAddress(address);
  if (!normalized || !options.fetcher) return null;

  if (options.googleApiKey) {
    try {
      const googleRes = await options.fetcher(buildGoogleGeocodeUrl(normalized, options.googleApiKey), {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (googleRes.ok) {
        const json = (await googleRes.json()) as {
          status?: string;
          results?: Array<{
            formatted_address?: string;
            geometry?: { location?: { lat?: number; lng?: number } };
          }>;
        };
        const first = json.results?.[0];
        const lat = Number(first?.geometry?.location?.lat);
        const lng = Number(first?.geometry?.location?.lng);
        if (json.status === "OK" && Number.isFinite(lat) && Number.isFinite(lng)) {
          return { lat, lng, displayName: first?.formatted_address };
        }
      }
    } catch {}
  }

  const nominatimRes = await options.fetcher(buildNominatimGeocodeUrl(normalized), {
    headers: DEFAULT_HEADERS,
    cache: "no-store",
  });
  if (!nominatimRes.ok) return null;
  const rows = (await nominatimRes.json()) as Array<{ lat: string; lon: string; display_name?: string }>;
  const first = rows?.[0];
  const lat = Number(first?.lat);
  const lng = Number(first?.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng, displayName: first?.display_name };
}

export async function estimateRoutePlanPortable(
  origin: GeoPoint,
  destination: GeoPoint,
  options: { fetcher?: PortableFetcher; googleApiKey?: string } = {},
): Promise<RoutePlan> {
  if (options.fetcher && options.googleApiKey) {
    try {
      const request = buildGoogleRoutesRequest(origin, destination, options.googleApiKey);
      const response = await options.fetcher(request.url, request.init);
      if (response.ok) {
        const json = (await response.json()) as {
          routes?: Array<{
            distanceMeters?: number;
            duration?: string;
            polyline?: { encodedPolyline?: string };
          }>;
        };
        const top = json.routes?.[0];
        const distanceMeters = Number(top?.distanceMeters);
        const durationSeconds = parseGoogleDurationSeconds(top?.duration);
        if (Number.isFinite(distanceMeters) && distanceMeters > 0 && durationSeconds && durationSeconds > 0) {
          const path = top?.polyline?.encodedPolyline
            ? decodeGooglePolyline(top.polyline.encodedPolyline)
            : interpolatePath(origin, destination);
          return {
            distanceKm: Number((distanceMeters / 1000).toFixed(2)),
            durationMin: Math.max(1, Math.round(durationSeconds / 60)),
            provider: "google_routes",
            path: path.length >= 2 ? path : interpolatePath(origin, destination),
          };
        }
      }
    } catch {}
  }

  if (options.fetcher) {
    try {
      const response = await options.fetcher(buildOsrmRouteUrl(origin, destination), {
        headers: DEFAULT_HEADERS,
        cache: "no-store",
      });
      if (response.ok) {
        const json = (await response.json()) as {
          code?: string;
          routes?: Array<{
            distance: number;
            duration: number;
            geometry?: { coordinates?: Array<[number, number]> };
          }>;
        };
        const top = json.routes?.[0];
        if (json.code === "Ok" && top) {
          const coords = top.geometry?.coordinates ?? [];
          return {
            distanceKm: Number((top.distance / 1000).toFixed(2)),
            durationMin: Math.max(1, Math.round(top.duration / 60)),
            provider: "osrm",
            path:
              coords.length >= 2
                ? coords.map((coord) => ({ lat: Number(coord[1]), lng: Number(coord[0]) }))
                : interpolatePath(origin, destination),
          };
        }
      }
    } catch {}
  }

  return estimateFallbackRoute(origin, destination);
}
