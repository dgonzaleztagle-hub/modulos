# Lista corta de módulos semilla para MODULOS

Priorizados por reutilización alta por sobre madurez.

## Semilla inmediata

1. `payments/mercadopago-core`
- fuentes: `rishtedar`, `pluscontable.cl`, `kurso`, `zeus`, `truckpos_new`
- razón: aparece en muchos verticales y evitaría reexplorar integraciones repetidas

2. `tenancy/tenant-config-core`
- fuentes: `pluscontable.cl`, `kurso`, `CorredoresPro`
- razón: features, límites, branding y estado comercial se repiten con distinta terminología

3. `booking/booking-locks`
- fuentes: `zeus`, con ecos en `rishtedar`
- razón: resuelve un problema fino y reutilizable de reserva retenida por pago

4. `delivery/order-state-machine`
- fuentes: `acargoo`
- razón: pequeño, claro y muy portable

5. `delivery/pricing-core`
- fuentes: `acargoo`
- razón: base para delivery/carga y adaptable a otros modelos de despacho

6. `pos/product-importer`
- fuentes: `truckpos_new`
- razón: utilitario puro, listo para salir con bajo costo de extracción

7. `pdf/tenant-branded-documents`
- fuentes: `pluscontable.cl`, `CorredoresPro`, `acargoo`
- razón: patrón transversal de documento con branding

8. `crm/support-inbox-core`
- fuentes: `kurso`, `hojacero`
- razón: el patrón de ticket/inbox aparece como necesidad transversal

## Semilla de segunda ola

- `food/food-engine-core`
- `crm/pipeline-board`
- `geo/territorial-intelligence`
- `notifications/dispatch-kit`
- `portals/role-based-portals`
- `cms/editable-content-core`

## Módulos valiosos pero todavía no recomendados para extracción directa

- `hojacero sales-agent`: gran valor, pero primero habría que neutralizar branding y discurso
- `rishtedar dashboard operativo`: útil como referencia, pero muy acoplado a la app
- `acargoo superficies admin/b2b/driver`: buena arquitectura de producto, pero no es un módulo pequeño
- `CorredoresPro publisher`: conviene documentar mejor contratos y adapters antes de moverlo
- `pluscontableapisii sync SII`: muy valioso para vertical contable chilena, pero depende de scraping sensible y no conviene meterlo al core sin wrapper o adapter específico
