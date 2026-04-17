# Fases de extracción

Objetivo: terminar `MODULOS` completo, pero en lotes que reduzcan riesgo y eviten extraer piezas demasiado acopladas antes de tener bases comunes.

## Principio rector

- pensar el repo completo desde el inicio
- ejecutar por fases pequeñas y seguras
- extraer primero bases transversales
- dejar para después los módulos con más UI, branding o flujo de negocio específico

## Fase 1: inventario y comparativos

Estado: completada

- catálogo inicial por repo
- comparativo de equivalencias
- lista corta de módulos semilla

## Fase 2: foundations transversales

Objetivo: crear la base reusable que servirá a varios verticales.

Lote:

1. `payments/mercadopago-core`
2. `tenancy/tenant-config-core`
3. `delivery/order-state-machine`
4. `delivery/pricing-core`
5. `pos/product-importer`
6. `pdf/tenant-branded-documents`

Regla:

- primero comparar variantes
- luego definir contrato común
- después extraer código mínimo viable

## Fase 3: backoffice y operación

Objetivo: consolidar módulos reutilizables para paneles operativos y flujos internos.

Lote:

1. `booking/booking-locks`
2. `crm/support-inbox-core`
3. `food/food-engine-core`
4. `crm/pipeline-board`
5. `notifications/dispatch-kit`
6. `portals/role-based-portals`

## Fase 4: verticales enriquecidos

Objetivo: capturar piezas de alto valor, pero con más dominio específico.

Lote:

1. `geo/territorial-intelligence`
2. `cms/editable-content-core`
3. `integrations/property-publisher-core`
4. `booking/agenda-core`
5. `delivery/tracking-core`

## Fase 5: blueprints

Objetivo: ensamblar módulos ya extraídos en recetas reutilizables por tipo de producto.

Lote:

1. `blueprint-delivery`
2. `blueprint-pos`
3. `blueprint-booking`
4. `blueprint-saas-multitenant`
5. `blueprint-crm-operativo`

## Criterio de avance

Una fase se considera cerrada cuando cada módulo del lote tiene:

- contrato definido
- carpeta propia en `modulos/`
- README corto
- origen documentado
- riesgos conocidos
- estado de extracción: usable o en refactor controlado

## Cuándo pedir ayuda

No se requiere decisión tuya para el flujo normal.

Solo vale la pena detenerse si aparece uno de estos casos:

- conflicto entre dos implementaciones igual de válidas
- dependencia externa que cambie el diseño del módulo
- código fuente demasiado mezclado como para extraerlo sin romper semántica
