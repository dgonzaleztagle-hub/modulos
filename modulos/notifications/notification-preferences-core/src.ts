export type NotificationPreferenceKey =
  | "tickets"
  | "expirations"
  | "low_stock"
  | "low_credits"
  | "whatsapp";

export type NotificationPreferences = Partial<Record<NotificationPreferenceKey, boolean | null>>;

export function isNotificationEnabled(input: {
  preferences?: NotificationPreferences | null;
  type: NotificationPreferenceKey;
  defaultValue?: boolean;
}) {
  const defaultValue = input.defaultValue ?? true;
  const value = input.preferences?.[input.type];
  return typeof value === "boolean" ? value : defaultValue;
}

export function mergeNotificationPreferences(
  base?: NotificationPreferences | null,
  override?: NotificationPreferences | null,
) {
  return {
    ...(base || {}),
    ...(override || {}),
  };
}

export function resolveEnabledNotificationTypes(
  preferences?: NotificationPreferences | null,
  types: NotificationPreferenceKey[] = ["tickets", "expirations", "low_stock", "low_credits", "whatsapp"],
) {
  return types.filter((type) => isNotificationEnabled({ preferences, type }));
}
