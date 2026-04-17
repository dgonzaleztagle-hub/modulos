# Contrato propuesto

## Interface mínima

```ts
interface TenantIdentity {
  id: string;
  slug?: string;
  name: string;
  plan?: string | null;
  status?: string | null;
}

interface TenantBranding {
  appName?: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  supportEmail?: string | null;
}

interface TenantLimits {
  [key: string]: number | boolean | null | undefined;
}

interface TenantFeatureMap {
  [feature: string]: boolean;
}

interface TenantRuntimeConfig {
  tenant: TenantIdentity;
  branding: TenantBranding;
  features: TenantFeatureMap;
  limits: TenantLimits;
}
```

## Responsabilidades

- resolver tenant actual
- fusionar defaults con overrides
- exponer branding, features y límites de forma estable
- ofrecer helpers de gating

## No responsabilidades

- autenticación
- facturación
- provisioning de base de datos
