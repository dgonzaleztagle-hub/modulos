# Caso: pluscontable.cl

## Tipo

`rrhh-documental`

## Qué resolvió

- shell multi-tenant con branding y gating por cliente
- onboarding público de trabajador mediante links temporales
- contratos laborales y anexos
- trazabilidad y valorización de eventos RRHH
- generación documental con branding de tenant

## Piezas que ya viven en `MODULOS`

- `tenancy/tenant-config-core`
- `tenancy/tenant-limits-core`
- `tenancy/tenant-shell-core`
- `access/worker-registration-link-core`
- `pdf/employment-contract-outline-core`
- `pdf/service-quote-outline-core`
- `pdf/honorarios-account-outline-core`
- `pdf/social-security-report-outline-core`
- `ops/worker-event-compensation-core`
- `pdf/tenant-branded-documents`

## Repos de origen

- `pluscontable.cl`

## Observaciones

- este caso confirma una línea reutilizable distinta al SaaS genérico: RRHH documental con onboarding y contratos
- el valor no está solo en PDFs, sino en el flujo completo desde link temporal hasta documento, cobranza y cálculo de eventos
