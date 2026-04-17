export interface PortalPermissionMap {
  [permission: string]: boolean;
}

export interface PortalNavigationItem {
  id: string;
  label: string;
  href: string;
  requiredPermission?: string;
}

export interface PortalSurface {
  role: string;
  surface: string;
  permissions: PortalPermissionMap;
  navigation: PortalNavigationItem[];
}

export function canAccessPermission(
  permissions: PortalPermissionMap,
  permission?: string,
): boolean {
  if (!permission) return true;
  return Boolean(permissions[permission]);
}

export function getVisibleNavigation(
  navigation: PortalNavigationItem[],
  permissions: PortalPermissionMap,
): PortalNavigationItem[] {
  return navigation.filter((item) => canAccessPermission(permissions, item.requiredPermission));
}

export function buildPortalSurface(input: PortalSurface): PortalSurface {
  return {
    ...input,
    navigation: getVisibleNavigation(input.navigation, input.permissions),
  };
}
