import crypto from "node:crypto";

export interface FlowCredentials {
  apiKey: string;
  secretKey: string;
  baseUrl?: string;
}

export type FlowParams = Record<string, string | number | boolean>;

function sortParams(params: FlowParams) {
  return Object.entries(params)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}

export function signFlowParams(params: FlowParams, secretKey: string) {
  return crypto.createHmac("sha256", secretKey).update(sortParams(params)).digest("hex");
}

export function buildFlowRequest(endpoint: string, params: FlowParams, credentials: FlowCredentials, method: "GET" | "POST" = "POST") {
  const withApiKey = { ...params, apiKey: credentials.apiKey };
  const signature = signFlowParams(withApiKey, credentials.secretKey);
  const finalParams = Object.fromEntries(
    Object.entries({ ...withApiKey, s: signature }).map(([key, value]) => [key, String(value)]),
  );
  const baseUrl = credentials.baseUrl || "https://www.flow.cl/api";

  return {
    endpoint: `${baseUrl}/${endpoint}`,
    method,
    query: method === "GET" ? new URLSearchParams(finalParams).toString() : "",
    body: method === "POST" ? new URLSearchParams(finalParams).toString() : "",
    params: finalParams,
  };
}

export function buildCreateFlowSubscription(input: {
  customerId: string;
  customerEmail: string;
  planId: string;
  urlCallback: string;
}) {
  return {
    customerId: input.customerId,
    customerEmail: input.customerEmail,
    planId: input.planId,
    urlCallback: input.urlCallback,
  };
}

export function buildCreateFlowPlan(input: { planId: string; name: string; amount: number }) {
  return {
    planId: input.planId,
    name: input.name,
    amount: input.amount,
    currency: "CLP",
    interval: 1,
  };
}

export function buildCreateFlowCustomer(input: { name: string; email: string; externalId: string }) {
  return {
    name: input.name,
    email: input.email,
    externalId: input.externalId,
  };
}

export function buildRegisterFlowCard(input: { customerId: string; urlReturn: string }) {
  return {
    customerId: input.customerId,
    url_return: input.urlReturn,
  };
}
