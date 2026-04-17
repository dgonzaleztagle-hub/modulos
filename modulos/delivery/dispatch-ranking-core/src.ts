export type DriverAvailabilityStatus = "offline" | "online" | "busy" | "break";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface DispatchVehicle {
  id: string;
  isActive: boolean;
}

export interface DispatchDriver {
  id: string;
  fullName: string;
  vehicleId?: string;
  isActive: boolean;
  availabilityStatus: DriverAvailabilityStatus;
  onShift: boolean;
  lastLocation?: GeoPoint;
  rating: number;
}

export interface DispatchOrderLike {
  pickupLat: number;
  pickupLng: number;
}

export interface DispatchCandidate {
  driverId: string;
  driverName: string;
  distanceKm: number;
  availabilityStatus: DriverAvailabilityStatus;
  score: number;
}

export interface RankingInput {
  order: DispatchOrderLike;
  drivers: DispatchDriver[];
  vehicles: DispatchVehicle[];
}

const availabilityWeight: Record<DriverAvailabilityStatus, number> = {
  online: 1,
  busy: 0.4,
  break: 0.2,
  offline: 0,
};

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

export function rankDispatchCandidates(input: RankingInput): DispatchCandidate[] {
  const pickup = { lat: input.order.pickupLat, lng: input.order.pickupLng };

  return input.drivers
    .filter((driver) => driver.isActive && driver.onShift && driver.availabilityStatus !== "offline" && driver.lastLocation)
    .map((driver) => {
      const vehicle = input.vehicles.find((item) => item.id === driver.vehicleId);
      const capacityFactor = vehicle?.isActive ? 1 : 0.3;
      const distance = haversineKm(pickup, driver.lastLocation!);
      const distanceScore = Math.max(0, 1 - distance / 25);
      const availabilityScore = availabilityWeight[driver.availabilityStatus];
      const qualityScore = Math.min(1, driver.rating / 5);
      const score = distanceScore * 0.55 + availabilityScore * 0.3 + qualityScore * 0.15;

      return {
        driverId: driver.id,
        driverName: driver.fullName,
        distanceKm: Number(distance.toFixed(2)),
        availabilityStatus: driver.availabilityStatus,
        score: Number((score * capacityFactor).toFixed(4)),
      };
    })
    .sort((left, right) => right.score - left.score);
}
