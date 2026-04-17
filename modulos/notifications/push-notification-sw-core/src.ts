export type PushNotificationPayload = {
  title?: string;
  body?: string;
  url?: string;
  tag?: string;
};

export type WebNotificationOptions = {
  body: string;
  icon: string;
  badge: string;
  data: { url: string };
  vibrate: number[];
  tag: string;
  renotify: boolean;
};

export function parsePushPayload(payload: {
  json?: () => unknown;
  text?: () => string;
}) {
  try {
    const jsonPayload = payload.json?.();
    return (jsonPayload as PushNotificationPayload) || {};
  } catch {
    return {
      title: 'Vuelve+',
      body: payload.text?.() || '',
    } satisfies PushNotificationPayload;
  }
}

export function buildWebNotification(
  payload: PushNotificationPayload,
  defaults?: {
    title?: string;
    fallbackUrl?: string;
    icon?: string;
    badge?: string;
    defaultTag?: string;
  },
) {
  return {
    title: payload.title || defaults?.title || 'Vuelve+',
    options: {
      body: payload.body || '',
      icon: defaults?.icon || '/logos/android-chrome-192x192.png',
      badge: defaults?.badge || '/logos/favicon-32x32.png',
      data: { url: payload.url || defaults?.fallbackUrl || '/cliente' },
      vibrate: [200, 100, 200],
      tag: payload.tag || defaults?.defaultTag || 'vuelve-push',
      renotify: true,
    } satisfies WebNotificationOptions,
  };
}

export function resolveNotificationClickTarget(
  payload: PushNotificationPayload | { data?: { url?: string } },
  fallbackUrl = '/cliente',
) {
  if ('data' in payload) {
    return payload.data?.url || fallbackUrl;
  }

  return (payload as PushNotificationPayload).url || fallbackUrl;
}
