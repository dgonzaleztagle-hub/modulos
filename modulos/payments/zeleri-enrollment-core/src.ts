import { ZeleriSignature } from "../zeleri-signature-core/src";

export interface ZeleriEnrollmentConfigInput {
  baseUrl: string;
  token: string;
  secret: string;
}

export interface ZeleriEnrollmentCustomer {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface ZeleriEnrollmentBody {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  signature: string;
}

export interface ZeleriEnrollmentOrderParams {
  cardId: string;
  title: string;
  description: string;
  amount: number;
  commerceOrder?: string;
  commerceReference?: string;
}

export interface ZeleriEnrollmentOrderBody {
  card_id: string;
  title: string;
  description: string;
  amount: number;
  commerce_order?: string;
  commerce_reference?: string;
  signature: string;
}

export interface ZeleriEnrollmentConfirmBody {
  order_id: number;
  customer_email: string;
  signature: string;
}

export interface ZeleriEnrollmentRequestPlan {
  url: string;
  method: "POST" | "GET";
  headers: Record<string, string>;
  body?: ZeleriEnrollmentBody | ZeleriEnrollmentOrderBody | ZeleriEnrollmentConfirmBody;
}

export function sanitizeZeleriEnrollmentConfig(
  config: ZeleriEnrollmentConfigInput,
): ZeleriEnrollmentConfigInput {
  return {
    baseUrl: sanitizeEnv(config.baseUrl, "https://sandbox-zeleri.dev.ionix.cl/integration-kit").replace(/\/+$/, ""),
    token: sanitizeEnv(config.token),
    secret: sanitizeEnv(config.secret),
  };
}

export function buildZeleriEnrollmentBody(
  customer: ZeleriEnrollmentCustomer,
  secret: string,
): ZeleriEnrollmentBody {
  if (!secret.trim()) {
    throw new Error("ZELERI_SECRET es requerido");
  }

  const body: Omit<ZeleriEnrollmentBody, "signature"> = {
    customer_name: String(customer.customerName || "").trim(),
    customer_email: String(customer.customerEmail || "").trim().toLowerCase(),
    customer_phone: String(customer.customerPhone || "").trim(),
  };

  const signer = new ZeleriSignature(secret.trim());
  return {
    ...body,
    signature: signer.generate(body),
  };
}

export function buildZeleriEnrollmentRequest(
  config: ZeleriEnrollmentConfigInput,
  customer: ZeleriEnrollmentCustomer,
): ZeleriEnrollmentRequestPlan {
  const normalizedConfig = sanitizeZeleriEnrollmentConfig(config);

  if (!normalizedConfig.token) {
    throw new Error("ZELERI_TOKEN es requerido");
  }

  return {
    url: `${normalizedConfig.baseUrl}/v1/enrollments/zeleri/enrollments`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${normalizedConfig.token}`,
    },
    body: buildZeleriEnrollmentBody(customer, normalizedConfig.secret),
  };
}

export function buildZeleriCardsListRequest(
  config: ZeleriEnrollmentConfigInput,
  customerEmail: string,
): ZeleriEnrollmentRequestPlan {
  const normalizedConfig = sanitizeZeleriEnrollmentConfig(config);

  if (!normalizedConfig.token) {
    throw new Error("ZELERI_TOKEN es requerido");
  }

  if (!normalizedConfig.secret) {
    throw new Error("ZELERI_SECRET es requerido");
  }

  const qs = `customer_email=${encodeURIComponent(String(customerEmail || "").trim().toLowerCase())}`;
  const signer = new ZeleriSignature(normalizedConfig.secret);
  const signature = signer.generate(qs);

  return {
    url: `${normalizedConfig.baseUrl}/v1/enrollments/zeleri/enrollments?${qs}&signature=${signature}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${normalizedConfig.token}`,
    },
  };
}

export function buildZeleriEnrollmentOrderBody(
  params: ZeleriEnrollmentOrderParams,
  secret: string,
): ZeleriEnrollmentOrderBody {
  if (!secret.trim()) {
    throw new Error("ZELERI_SECRET es requerido");
  }

  const body: Omit<ZeleriEnrollmentOrderBody, "signature"> = {
    card_id: String(params.cardId || "").trim(),
    title: String(params.title || "").trim(),
    description: String(params.description || "").trim(),
    amount: Number(params.amount),
  };

  if (params.commerceOrder) {
    body.commerce_order = params.commerceOrder;
  }

  if (params.commerceReference) {
    body.commerce_reference = params.commerceReference;
  }

  const signer = new ZeleriSignature(secret.trim());
  return {
    ...body,
    signature: signer.generate(body),
  };
}

export function buildZeleriEnrollmentOrderRequest(
  config: ZeleriEnrollmentConfigInput,
  params: ZeleriEnrollmentOrderParams,
): ZeleriEnrollmentRequestPlan {
  const normalizedConfig = sanitizeZeleriEnrollmentConfig(config);

  if (!normalizedConfig.token) {
    throw new Error("ZELERI_TOKEN es requerido");
  }

  return {
    url: `${normalizedConfig.baseUrl}/v1/enrollments/zeleri/orders`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${normalizedConfig.token}`,
    },
    body: buildZeleriEnrollmentOrderBody(params, normalizedConfig.secret),
  };
}

export function buildZeleriEnrollmentConfirmBody(
  orderId: number,
  customerEmail: string,
  secret: string,
): ZeleriEnrollmentConfirmBody {
  if (!secret.trim()) {
    throw new Error("ZELERI_SECRET es requerido");
  }

  const body: Omit<ZeleriEnrollmentConfirmBody, "signature"> = {
    order_id: Number(orderId),
    customer_email: String(customerEmail || "").trim().toLowerCase(),
  };

  const signer = new ZeleriSignature(secret.trim());
  return {
    ...body,
    signature: signer.generate(body),
  };
}

export function buildZeleriEnrollmentConfirmRequest(
  config: ZeleriEnrollmentConfigInput,
  orderId: number,
  customerEmail: string,
): ZeleriEnrollmentRequestPlan {
  const normalizedConfig = sanitizeZeleriEnrollmentConfig(config);

  if (!normalizedConfig.token) {
    throw new Error("ZELERI_TOKEN es requerido");
  }

  return {
    url: `${normalizedConfig.baseUrl}/v1/enrollments/zeleri/orders/confirm`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${normalizedConfig.token}`,
    },
    body: buildZeleriEnrollmentConfirmBody(orderId, customerEmail, normalizedConfig.secret),
  };
}

function sanitizeEnv(value: string | undefined, fallback = "") {
  const raw = String(value ?? fallback).trim();
  return raw.replace(/^['"]+|['"]+$/g, "").trim();
}
