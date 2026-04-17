export type BookingPaymentStatus = "pending" | "paid" | "failed";

export interface BookingLike {
  id: string;
  paymentStatus: BookingPaymentStatus;
  paymentMethod?: string | null;
  paymentId?: string | null;
  createdAt: string;
}

export interface PaymentGatewayAdapter {
  supports: (paymentMethod?: string | null) => boolean;
  resolveStatus: (booking: BookingLike) => Promise<BookingPaymentStatus>;
}

export interface BookingResolution<TBooking extends BookingLike> {
  booking: TBooking;
  previousStatus: BookingPaymentStatus;
  currentStatus: BookingPaymentStatus;
  reason: string;
}

export interface BookingLockResult<TBooking extends BookingLike> {
  resolutions: Array<BookingResolution<TBooking>>;
  blocking: TBooking[];
}

export interface BookingLockOptions<TBooking extends BookingLike> {
  holdMinutes: number;
  clone?: (booking: TBooking, status: BookingPaymentStatus) => TBooking;
  onAdapterError?: "keep-pending" | "mark-failed";
}

export function isExpiredPendingBooking(
  booking: BookingLike,
  holdMinutes: number,
  now = Date.now(),
): boolean {
  if (booking.paymentStatus !== "pending") return false;
  const createdAt = new Date(booking.createdAt).getTime();
  if (!Number.isFinite(createdAt)) return false;
  return createdAt < now - holdMinutes * 60 * 1000;
}

export async function reconcileBookings<TBooking extends BookingLike>(
  bookings: TBooking[],
  adapters: PaymentGatewayAdapter[],
  options: BookingLockOptions<TBooking>,
): Promise<BookingLockResult<TBooking>> {
  const resolutions: Array<BookingResolution<TBooking>> = [];
  const normalized: TBooking[] = [];

  for (const booking of bookings) {
    if (!isExpiredPendingBooking(booking, options.holdMinutes)) {
      normalized.push(booking);
      continue;
    }

    const adapter = adapters.find((candidate) => candidate.supports(booking.paymentMethod));
    if (!adapter) {
      const failed = cloneBooking(booking, "failed", options.clone);
      normalized.push(failed);
      resolutions.push({
        booking: failed,
        previousStatus: booking.paymentStatus,
        currentStatus: "failed",
        reason: "No payment adapter matched this pending booking",
      });
      continue;
    }

    try {
      const resolvedStatus = await adapter.resolveStatus(booking);
      const updated = cloneBooking(booking, resolvedStatus, options.clone);
      normalized.push(updated);
      resolutions.push({
        booking: updated,
        previousStatus: booking.paymentStatus,
        currentStatus: resolvedStatus,
        reason: `Resolved by payment adapter for method ${booking.paymentMethod ?? "unknown"}`,
      });
    } catch (error) {
      const fallbackStatus = options.onAdapterError === "mark-failed" ? "failed" : "pending";
      const updated = cloneBooking(booking, fallbackStatus, options.clone);
      normalized.push(updated);
      resolutions.push({
        booking: updated,
        previousStatus: booking.paymentStatus,
        currentStatus: fallbackStatus,
        reason: `Payment adapter failed: ${toErrorMessage(error)}`,
      });
    }
  }

  return {
    resolutions,
    blocking: normalized.filter((booking) => booking.paymentStatus === "paid" || booking.paymentStatus === "pending"),
  };
}

function cloneBooking<TBooking extends BookingLike>(
  booking: TBooking,
  status: BookingPaymentStatus,
  clone?: (booking: TBooking, status: BookingPaymentStatus) => TBooking,
): TBooking {
  if (clone) return clone(booking, status);
  return { ...booking, paymentStatus: status };
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown adapter error";
}
