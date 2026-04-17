import test from "node:test";
import assert from "node:assert/strict";

import {
  canAccessPermission,
  getVisibleNavigation,
  buildPortalSurface,
} from "../.dist/modulos/portals/role-based-portals/src.js";

test("role-based-portals filtra navegación por permisos", () => {
  const navigation = getVisibleNavigation(
    [
      { id: "dashboard", label: "Dashboard", href: "/d" },
      { id: "billing", label: "Billing", href: "/b", requiredPermission: "billing:view" },
    ],
    { "billing:view": false },
  );

  assert.equal(canAccessPermission({ "billing:view": true }, "billing:view"), true);
  assert.equal(navigation.length, 1);
});

test("role-based-portals arma superficie filtrada", () => {
  const surface = buildPortalSurface({
    role: "owner",
    surface: "portal",
    permissions: { "billing:view": true },
    navigation: [{ id: "billing", label: "Billing", href: "/b", requiredPermission: "billing:view" }],
  });

  assert.equal(surface.navigation.length, 1);
});
