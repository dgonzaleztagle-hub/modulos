export type NotificationChannel = "email" | "push" | "sms" | "whatsapp" | "in_app";

export interface NotificationMessage {
  subject?: string;
  body: string;
  html?: string;
}

export interface NotificationRecipient {
  id?: string;
  email?: string;
  phone?: string;
  pushToken?: string;
}

export interface NotificationDispatchRequest {
  channel: NotificationChannel;
  recipient: NotificationRecipient;
  message: NotificationMessage;
  metadata?: Record<string, unknown>;
}

export interface NotificationDispatchResult {
  channel: NotificationChannel;
  delivered: boolean;
  providerMessageId?: string;
  error?: string;
}

export interface NotificationAdapter {
  supports: (channel: NotificationChannel) => boolean;
  send: (request: NotificationDispatchRequest) => Promise<NotificationDispatchResult>;
}

export async function dispatchNotification(
  request: NotificationDispatchRequest,
  adapters: NotificationAdapter[],
): Promise<NotificationDispatchResult> {
  const adapter = adapters.find((candidate) => candidate.supports(request.channel));

  if (!adapter) {
    return {
      channel: request.channel,
      delivered: false,
      error: `No adapter for channel ${request.channel}`,
    };
  }

  return adapter.send(request);
}
