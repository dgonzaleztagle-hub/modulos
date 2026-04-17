export type MercadoPagoPaymentStatus =
  | "pending"
  | "authorized"
  | "in_process"
  | "approved"
  | "rejected"
  | "cancelled"
  | "refunded"
  | "charged_back";

export interface CheckoutIntentInput {
  title: string;
  amount: number;
  externalReference: string;
  payerEmail?: string;
  successUrl?: string;
  failureUrl?: string;
  pendingUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface CheckoutCallbackUrls {
  success?: string;
  failure?: string;
  pending?: string;
}

export interface CheckoutIntentResult {
  provider: "mercadopago";
  preferenceId?: string;
  checkoutUrl?: string;
  externalReference: string;
  payload: {
    title: string;
    unit_price: number;
    quantity: 1;
    external_reference: string;
    payer?: {
      email?: string;
    };
    back_urls?: CheckoutCallbackUrls;
    metadata?: Record<string, unknown>;
  };
}

export interface NormalizedPaymentEvent {
  provider: "mercadopago";
  externalReference?: string;
  paymentId?: string;
  topic?: string;
  status: MercadoPagoPaymentStatus;
  approved: boolean;
  raw: unknown;
}

export function isApprovedMercadoPagoStatus(status?: string | null): boolean {
  return normalizeMercadoPagoStatus(status) === "approved";
}

export function isFinalMercadoPagoStatus(status?: string | null): boolean {
  const normalized = normalizeMercadoPagoStatus(status);
  return normalized !== "pending" && normalized !== "in_process" && normalized !== "authorized";
}

export function normalizeMercadoPagoStatus(status?: string | null): MercadoPagoPaymentStatus {
  const normalized = String(status || "").toLowerCase().trim();

  switch (normalized) {
    case "approved":
      return "approved";
    case "authorized":
      return "authorized";
    case "in_process":
      return "in_process";
    case "rejected":
      return "rejected";
    case "cancelled":
      return "cancelled";
    case "refunded":
      return "refunded";
    case "charged_back":
      return "charged_back";
    case "pending":
    default:
      return "pending";
  }
}

export function normalizeMercadoPagoEvent(raw: Record<string, unknown>): NormalizedPaymentEvent {
  const status = normalizeMercadoPagoStatus(
    readStringPath(raw, ["status"]) ??
      readStringPath(raw, ["data", "status"]) ??
      readStringPath(raw, ["payment", "status"]),
  );
  const paymentId =
    readPath(raw, ["id"]) ??
    readPath(raw, ["data", "id"]) ??
    readPath(raw, ["payment_id"]);
  const externalReference =
    readPath(raw, ["external_reference"]) ??
    readPath(raw, ["data", "external_reference"]) ??
    readPath(raw, ["metadata", "external_reference"]) ??
    readPath(raw, ["additional_info", "external_reference"]) ??
    readPath(raw, ["payment", "external_reference"]);
  const topic =
    readPath(raw, ["type"]) ??
    readPath(raw, ["topic"]) ??
    readPath(raw, ["action"]);

  return {
    provider: "mercadopago",
    paymentId: paymentId ? String(paymentId) : undefined,
    externalReference: externalReference ? String(externalReference) : undefined,
    topic: topic ? String(topic).trim().toLowerCase() : undefined,
    status,
    approved: status === "approved",
    raw,
  };
}

export function buildMercadoPagoBackUrls(input: {
  baseUrl: string;
  successPath: string;
  failurePath?: string;
  pendingPath?: string;
}) {
  const baseUrl = normalizeUrl(input.baseUrl);
  if (!baseUrl) {
    throw new Error("baseUrl is required");
  }

  return {
    success: new URL(input.successPath, baseUrl).toString(),
    failure: new URL(input.failurePath || input.successPath, baseUrl).toString(),
    pending: new URL(input.pendingPath || input.successPath, baseUrl).toString(),
  };
}

export function buildMercadoPagoNotificationUrl(baseUrl: string, path = "/api/payments/webhook/mercadopago") {
  const normalizedBase = normalizeUrl(baseUrl);
  if (!normalizedBase || normalizedBase.includes("localhost")) return undefined;
  return new URL(path, normalizedBase).toString();
}

export function normalizeMercadoPagoPayerEmail(baseUrl: string, email: string, localhostFallback?: string) {
  const normalizedEmail = normalizeOptionalString(email);
  if (!normalizedEmail) {
    throw new Error("payer email is required");
  }

  const normalizedBase = normalizeUrl(baseUrl);
  if (normalizedBase && normalizedBase.includes("localhost")) {
    return localhostFallback || "checkout.bricks@example.com";
  }

  return normalizedEmail;
}

export function splitPayerName(fullName: string) {
  const trimmed = String(fullName || "").trim();
  if (!trimmed) {
    return { firstName: "", lastName: "" };
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { firstName: trimmed, lastName: "" };
  }

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts.slice(-1).join(" "),
  };
}

export function extractMercadoPagoWebhookPaymentId(
  payload: Record<string, unknown>,
  searchParams?: URLSearchParams,
) {
  return (
    String(
      readPath(payload, ["data", "id"]) ??
        readPath(payload, ["id"]) ??
        searchParams?.get("data.id") ??
        searchParams?.get("id") ??
        "",
    ).trim() || null
  );
}

export function extractScopedExternalReference(reference: string, scope: string) {
  const [normalizedScope, entityId, ...rest] = String(reference || "").split("|");
  if (normalizedScope !== scope || !entityId) return null;
  return {
    scope: normalizedScope,
    entityId,
    extra: rest,
  };
}

export function buildCheckoutIntent(input: CheckoutIntentInput): CheckoutIntentResult {
  const title = String(input.title || "").trim();
  const externalReference = String(input.externalReference || "").trim();

  if (!title) {
    throw new Error("Checkout title is required");
  }

  if (!externalReference) {
    throw new Error("externalReference is required");
  }

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Checkout amount must be greater than zero");
  }

  const callbackUrls = cleanObject({
    success: normalizeUrl(input.successUrl),
    failure: normalizeUrl(input.failureUrl),
    pending: normalizeUrl(input.pendingUrl),
  }) as CheckoutCallbackUrls;

  const payer = cleanObject({
    email: normalizeOptionalString(input.payerEmail),
  }) as { email?: string };

  return {
    provider: "mercadopago",
    externalReference,
    payload: {
      title,
      unit_price: roundCurrency(input.amount),
      quantity: 1,
      external_reference: externalReference,
      ...(Object.keys(payer).length > 0 ? { payer } : {}),
      ...(Object.keys(callbackUrls).length > 0 ? { back_urls: callbackUrls } : {}),
      ...(input.metadata ? { metadata: input.metadata } : {}),
    },
  };
}

function readPath(input: Record<string, unknown>, path: string[]): unknown {
  let current: unknown = input;

  for (const segment of path) {
    if (!current || typeof current !== "object" || !(segment in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

function readStringPath(input: Record<string, unknown>, path: string[]): string | undefined {
  const value = readPath(input, path);
  return value == null ? undefined : String(value);
}

function cleanObject<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, candidate]) => candidate !== undefined),
  ) as Partial<T>;
}

function normalizeUrl(value?: string): string | undefined {
  const normalized = normalizeOptionalString(value);
  if (!normalized) return undefined;

  try {
    return new URL(normalized).toString();
  } catch {
    throw new Error(`Invalid URL provided: ${normalized}`);
  }
}

function normalizeOptionalString(value?: string | null): string | undefined {
  const normalized = String(value || "").trim();
  return normalized || undefined;
}

function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100;
}
