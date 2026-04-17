export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

export interface PushSubscriptionRecord {
  id: string;
  tenantId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  customerPhone?: string | null;
}

export interface PushAudienceInput {
  tenantId: string;
  customerPhone?: string | null;
}

export interface PushAttemptResult {
  subscriptionId: string;
  success: boolean;
  statusCode?: number;
  error?: string;
}

export interface PushDeliverySummary {
  delivered: number;
  failed: number;
  expiredIds: string[];
  retryableIds: string[];
}

function normalizeText(value: string | undefined) {
  return (value || "").replace(/\s+/g, " ").trim();
}

export function normalizePushPayload(payload: PushPayload): PushPayload {
  return {
    title: normalizeText(payload.title) || "Actualización disponible",
    body: normalizeText(payload.body) || "Abre tu panel para ver el detalle.",
    url: normalizeText(payload.url),
    tag: normalizeText(payload.tag),
  };
}

export function filterSubscriptionsForAudience(
  subscriptions: PushSubscriptionRecord[],
  audience: PushAudienceInput,
) {
  return subscriptions.filter((subscription) => {
    if (subscription.tenantId !== audience.tenantId) return false;
    if (!audience.customerPhone) return true;
    return (subscription.customerPhone || "") === audience.customerPhone;
  });
}

export function buildWebPushRequestPayload(payload: PushPayload) {
  return JSON.stringify(normalizePushPayload(payload));
}

export function classifyPushAttempt(result: PushAttemptResult) {
  if (result.success) return "delivered" as const;
  if (result.statusCode === 404 || result.statusCode === 410) return "expired" as const;
  return "retryable" as const;
}

export function summarizePushDelivery(results: PushAttemptResult[]): PushDeliverySummary {
  const summary: PushDeliverySummary = {
    delivered: 0,
    failed: 0,
    expiredIds: [],
    retryableIds: [],
  };

  for (const result of results) {
    const kind = classifyPushAttempt(result);
    if (kind === "delivered") {
      summary.delivered += 1;
      continue;
    }

    summary.failed += 1;
    if (kind === "expired") {
      summary.expiredIds.push(result.subscriptionId);
    } else {
      summary.retryableIds.push(result.subscriptionId);
    }
  }

  return summary;
}

