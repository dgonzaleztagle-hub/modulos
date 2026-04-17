import { ZeleriSignature } from "../zeleri-signature-core/src";

export interface ZeleriConfigInput {
  baseUrl: string;
  token: string;
  secret: string;
}

export interface ZeleriOneShotCustomer {
  email: string;
  name: string;
  phone?: string;
}

export interface ZeleriOneShotOrderParams {
  title: string;
  description: string;
  amount: number;
  customer: ZeleriOneShotCustomer;
  successUrl: string;
  failureUrl: string;
  commerceOrder?: string;
  commerceReference?: string;
  gatewayId?: number;
  sessionTtl?: number;
}

export interface ZeleriOneShotBody {
  title: string;
  description: string;
  currency_id: number;
  amount: number;
  customer: {
    email: string;
    name: string;
    phone: string;
  };
  success_url: string;
  failure_url: string;
  gateway_id: number;
  session_ttl: number;
  commerce_order?: string;
  commerce_reference?: string;
  signature: string;
}

export interface ZeleriRequestPlan {
  url: string;
  method: "POST" | "GET";
  headers: Record<string, string>;
  body?: ZeleriOneShotBody;
}

export interface ZeleriOrderDetailShape {
  data?: {
    status?: string | null;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
}

export function sanitizeZeleriConfig(config: ZeleriConfigInput): ZeleriConfigInput {
  return {
    baseUrl: sanitizeEnv(config.baseUrl, "https://sandbox-zeleri.dev.ionix.cl/integration-kit").replace(/\/+$/, ""),
    token: sanitizeEnv(config.token),
    secret: sanitizeEnv(config.secret),
  };
}

export function buildZeleriOneShotBody(
  params: ZeleriOneShotOrderParams,
  secret: string,
): ZeleriOneShotBody {
  if (!secret.trim()) {
    throw new Error("ZELERI_SECRET es requerido");
  }

  const body: Omit<ZeleriOneShotBody, "signature"> = {
    title: params.title,
    description: params.description,
    currency_id: 1,
    amount: Number(params.amount),
    customer: {
      email: String(params.customer.email || "").trim().toLowerCase(),
      name: String(params.customer.name || "").trim(),
      phone: String(params.customer.phone || "").trim(),
    },
    success_url: params.successUrl,
    failure_url: params.failureUrl,
    gateway_id: params.gatewayId ?? 4,
    session_ttl: params.sessionTtl ?? 300,
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

export function buildZeleriOneShotRequest(
  config: ZeleriConfigInput,
  params: ZeleriOneShotOrderParams,
): ZeleriRequestPlan {
  const normalizedConfig = sanitizeZeleriConfig(config);

  if (!normalizedConfig.token) {
    throw new Error("ZELERI_TOKEN es requerido");
  }

  const body = buildZeleriOneShotBody(params, normalizedConfig.secret);

  return {
    url: `${normalizedConfig.baseUrl}/v1/checkout/orders`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${normalizedConfig.token}`,
    },
    body,
  };
}

export function buildZeleriOrderDetailRequest(
  config: ZeleriConfigInput,
  orderId: number | string,
): ZeleriRequestPlan {
  const normalizedConfig = sanitizeZeleriConfig(config);

  if (!normalizedConfig.token) {
    throw new Error("ZELERI_TOKEN es requerido");
  }

  if (!normalizedConfig.secret) {
    throw new Error("ZELERI_SECRET es requerido");
  }

  const qs = `id=${encodeURIComponent(String(orderId))}`;
  const signer = new ZeleriSignature(normalizedConfig.secret);
  const signature = signer.generate(qs);

  return {
    url: `${normalizedConfig.baseUrl}/v1/orders/detail?${qs}&signature=${signature}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${normalizedConfig.token}`,
    },
  };
}

export function normalizeZeleriOrderStatus(status?: string | null) {
  return String(status || "").trim().toLowerCase();
}

export function isZeleriOneShotPaid(input: string | ZeleriOrderDetailShape) {
  const status = typeof input === "string"
    ? normalizeZeleriOrderStatus(input)
    : normalizeZeleriOrderStatus(input?.data?.status);

  return status === "paid" || status === "approved" || status === "completed";
}

function sanitizeEnv(value: string | undefined, fallback = "") {
  const raw = String(value ?? fallback).trim();
  return raw.replace(/^['"]+|['"]+$/g, "").trim();
}
