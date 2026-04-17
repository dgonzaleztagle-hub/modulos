# tenant-host-routing-core

Utilidades para detectar tenants por subdominio y resolver cuándo hacer rewrites multi-tenant.

## Qué resuelve

- extracción portable de tenant desde un host
- exclusión de `localhost`, `www` y previews de `vercel.app`
- chequeo simple de orígenes CORS permitidos

## Origen

- `superpanel3.0/apps/reseller/src/middleware.ts`

## Estado

`usable inicial endurecido`

## Estado real

Ya concentra la lógica base de detección por host y rewrite multi-tenant sin depender del middleware original.
