export type PricingMode = "fixed_by_service" | "manual_quote" | "base_plus_km";
export type PaymentTiming = "before_service" | "after_service";

export interface PricingService {
  basePrice: number;
  pricePerKm: number;
  multiplier?: number;
}

export interface PricingInput {
  service: PricingService;
  distanceKm: number;
  pricingMode: PricingMode;
  manualTotalPrice?: number;
}

export function calculatePrice(input: PricingInput): number {
  const { service, distanceKm, pricingMode, manualTotalPrice } = input;
  const multiplier = service.multiplier ?? 1;

  switch (pricingMode) {
    case "fixed_by_service":
      return roundMoney(service.basePrice);
    case "manual_quote":
      if (typeof manualTotalPrice !== "number" || manualTotalPrice <= 0) {
        throw new Error("manualTotalPrice is required for manual_quote mode");
      }
      return roundMoney(manualTotalPrice);
    case "base_plus_km":
    default:
      return roundMoney((service.basePrice + distanceKm * service.pricePerKm) * multiplier);
  }
}

export function resolvePaymentTiming(
  explicit: PaymentTiming | undefined,
  defaultTiming: PaymentTiming,
): PaymentTiming {
  return explicit ?? defaultTiming;
}

export function roundMoney(value: number): number {
  return Math.round(value);
}
