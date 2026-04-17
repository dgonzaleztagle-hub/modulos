import test from "node:test";
import assert from "node:assert/strict";

import {
  filterBannerPromotions,
  filterActivePromotions,
  pickPrimaryPromotion,
} from "../.dist/modulos/cms/promotions-banner-engine/src.js";

const SAMPLE = [
  {
    id: "p1",
    title: "Promo 1",
    discountType: "percent",
    discountValue: 20,
    applicableTo: "all_orders",
    businessId: null,
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    dayOfWeek: null,
    startHour: null,
    endHour: null,
    isActive: true,
    showAsBanner: true,
  },
  {
    id: "p2",
    title: "Promo 2",
    discountType: "percent",
    discountValue: 40,
    applicableTo: "delivery_only",
    businessId: "b1",
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    dayOfWeek: 4,
    startHour: 18,
    endHour: 23,
    isActive: true,
    showAsBanner: false,
  },
];

test("promotions-banner-engine filters active and banner promos", () => {
  const now = new Date("2026-01-01T19:00:00.000Z");
  const active = filterActivePromotions(SAMPLE, { businessId: "b1", now });
  const banners = filterBannerPromotions(SAMPLE, { businessId: "b1", now });
  assert.equal(active.length >= 1, true);
  assert.equal(banners.length, 1);
});

test("promotions-banner-engine picks best active promo", () => {
  const now = new Date("2026-01-01T22:00:00.000Z");
  const picked = pickPrimaryPromotion(SAMPLE, { businessId: "b1", now });
  assert.equal(picked?.id, "p2");
});
