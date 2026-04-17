# Estado de construcción

## Estado macro

`MODULOS` ya está en fase de consolidación fuerte, no de descubrimiento.

Estado actual:

- catálogo: cubierto y ya absorbido en gran parte por módulos reales
- módulos: `100` registrados
- endurecidos: `97`
- referencias finales explícitas: `3`
- viewer/registry/blueprints: alineados con el estado formal
- validación actual: build, tests y check en verde

## Qué significa hoy

- la mayor parte del valor reusable ya vive dentro de `modulos/`
- lo que no fue absorbido quedó marcado como `referencia final`, no como área abierta de trabajo
- el viewer ya debería reflejar una base ampliamente endurecida en vez de una base verde/incipiente
- el barrido raíz ya cubre no solo repos madre, sino también satélites útiles, referencias visuales y carpetas auxiliares ya clasificadas como tales

## Familias ya firmes

- pagos: Mercado Pago, Flow, router multi-gateway, grouping, allocation y familia Zeleri
- tenancy: config, shell, host routing, límites y billing plan catalog
- delivery/tracking: state machine, pricing, tracking, route planning, dispatch ranking, compliance y toll pricing
- CRM/ops: pipeline, inbox, lead hunting, loyalty, growth, sales agent, snapshots, reportes, alertas y utilidades Chile
- factory/white-label: landing factory, free page builder y configuración programática de motores
- documentos: outlines de contratos, propuestas, reportes territoriales, sociales, seguridad y branding tenant

## Lo único que queda fuera de `modulos/`

- familias más amplias o de referencia que conviene dejar como capa de diseño/fuente en vez de core final ya cerrado
- no corresponden a huecos grandes del inventario principal
- el patrón actual es claro: `landing-factory`, `scraping-intelligence-kit` y `reseller-landing-layout-core` quedaron como `referencia final` por ser wrappers más compuestos o más acoplados, no por haberse quedado botados
