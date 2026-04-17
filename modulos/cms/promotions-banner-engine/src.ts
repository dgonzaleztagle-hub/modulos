export interface PromotionRule {
  id: string;
  title: string;
  description?: string | null;
  discountType: "percent" | "fixed_amount";
  discountValue: number;
  applicableTo: "all_orders" | "delivery_only" | "dine_in_only" | "reservation_only";
  businessId?: string | null;
  validFrom: string;
  validTo: string;
  dayOfWeek?: number | null;
  startHour?: number | null;
  endHour?: number | null;
  isActive: boolean;
  usageCount?: number;
  showAsBanner?: boolean;
  imageUrl?: string | null;
  fontFamily?: string | null;
  fontSize?: number | null;
  textColor?: string | null;
  backgroundColor?: string | null;
  overlayOpacity?: number | null;
  bannerPadding?: number | null;
  borderRadius?: number | null;
}

export interface PromotionFilterContext {
  businessId?: string | null;
  now?: Date;
}

export function normalizePromotionRule(raw: Record<string, unknown>): PromotionRule {
  return {
    id: String(raw.id ?? ""),
    title: String(raw.title ?? "").trim(),
    description: raw.description == null ? null : String(raw.description),
    discountType: raw.discount_type === "fixed_amount" ? "fixed_amount" : "percent",
    discountValue: Number(raw.discount_value ?? 0),
    applicableTo:
      raw.applicable_to === "delivery_only" ||
      raw.applicable_to === "dine_in_only" ||
      raw.applicable_to === "reservation_only"
        ? (raw.applicable_to as PromotionRule["applicableTo"])
        : "all_orders",
    businessId: raw.business_id == null ? null : String(raw.business_id),
    validFrom: String(raw.valid_from ?? ""),
    validTo: String(raw.valid_to ?? ""),
    dayOfWeek: raw.day_of_week == null ? null : Number(raw.day_of_week),
    startHour: raw.start_hour == null ? null : Number(raw.start_hour),
    endHour: raw.end_hour == null ? null : Number(raw.end_hour),
    isActive: Boolean(raw.is_active),
    usageCount: raw.usage_count == null ? 0 : Number(raw.usage_count),
    showAsBanner: Boolean(raw.show_as_banner),
    imageUrl: raw.image_url == null ? null : String(raw.image_url),
    fontFamily: raw.font_family == null ? null : String(raw.font_family),
    fontSize: raw.font_size == null ? null : Number(raw.font_size),
    textColor: raw.text_color == null ? null : String(raw.text_color),
    backgroundColor: raw.background_color == null ? null : String(raw.background_color),
    overlayOpacity: raw.overlay_opacity == null ? null : Number(raw.overlay_opacity),
    bannerPadding: raw.banner_padding == null ? null : Number(raw.banner_padding),
    borderRadius: raw.border_radius == null ? null : Number(raw.border_radius),
  };
}

export function isPromotionActive(rule: PromotionRule, context?: PromotionFilterContext): boolean {
  if (!rule.isActive) return false;
  const now = context?.now ?? new Date();
  const today = now.toISOString().slice(0, 10);
  if (rule.validFrom && today < rule.validFrom) return false;
  if (rule.validTo && today > rule.validTo) return false;
  if (context?.businessId && rule.businessId && rule.businessId !== context.businessId) return false;
  if (rule.dayOfWeek != null && rule.dayOfWeek !== now.getDay()) return false;
  if (rule.startHour != null && rule.endHour != null) {
    const hour = now.getHours();
    if (hour < rule.startHour || hour >= rule.endHour) return false;
  }
  return true;
}

export function filterActivePromotions(rules: PromotionRule[], context?: PromotionFilterContext): PromotionRule[] {
  return rules.filter((rule) => isPromotionActive(rule, context));
}

export function pickPrimaryPromotion(rules: PromotionRule[], context?: PromotionFilterContext): PromotionRule | null {
  const active = filterActivePromotions(rules, context);
  return (
    [...active].sort((left, right) => {
      if (right.discountValue !== left.discountValue) return right.discountValue - left.discountValue;
      return (left.usageCount ?? 0) - (right.usageCount ?? 0);
    })[0] || null
  );
}

export function filterBannerPromotions(rules: PromotionRule[], context?: PromotionFilterContext): PromotionRule[] {
  return filterActivePromotions(rules, context).filter((rule) => rule.showAsBanner);
}

export function buildPromotionPayload(input: Partial<PromotionRule>): Partial<PromotionRule> {
  return {
    title: input.title?.trim(),
    description: input.description ?? null,
    discountType: input.discountType ?? "percent",
    discountValue: Number(input.discountValue ?? 0),
    applicableTo: input.applicableTo ?? "all_orders",
    businessId: input.businessId ?? null,
    validFrom: input.validFrom,
    validTo: input.validTo,
    dayOfWeek: input.dayOfWeek ?? null,
    startHour: input.startHour ?? null,
    endHour: input.endHour ?? null,
    showAsBanner: input.showAsBanner ?? false,
    imageUrl: input.showAsBanner ? input.imageUrl ?? null : null,
    fontFamily: input.showAsBanner ? input.fontFamily ?? null : null,
    fontSize: input.showAsBanner ? input.fontSize ?? null : null,
    textColor: input.showAsBanner ? input.textColor ?? null : null,
    backgroundColor: input.showAsBanner ? input.backgroundColor ?? null : null,
    overlayOpacity: input.showAsBanner ? input.overlayOpacity ?? null : null,
    bannerPadding: input.showAsBanner ? input.bannerPadding ?? null : null,
    borderRadius: input.showAsBanner ? input.borderRadius ?? null : null,
  };
}
