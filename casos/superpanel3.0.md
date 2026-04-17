# Caso: superpanel3.0

## Tipo

`saas-multitenant`

## Qué resolvió

- panel reseller multi-tenant con foco en suscripciones, stock de créditos y alertas operativas
- backup/snapshot de tenants reales con manifiesto exportable
- políticas de vencimiento, rate limit y preferencias de notificación por reseller
- operación financiera con costo ponderado y resets mensuales de saldo
- construcción visual de superficies white-label en dos niveles: landing seccional por reseller y builder libre tipo canvas

## Piezas que ya viven en `MODULOS`

- `ops/snapshot-toolkit`
- `ops/subscription-alerts-core`
- `ops/expiration-window-core`
- `ops/monthly-credit-reset-core`
- `ops/rate-limit-core`
- `ops/weighted-cost-core`
- `payments/currency-format-core`
- `notifications/notification-preferences-core`
- `factory/free-page-builder-core`

## Piezas identificadas pero todavía no bajadas como módulo independiente

- `cms/reseller-landing-layout-core`

## Repos de origen

- `superpanel3.0`

## Observaciones

- este caso aporta una capa operativa SaaS muy útil entre billing, alerts y snapshots
- la mayor parte de su valor está en reglas pequeñas pero frecuentes, no en una sola feature enorme
- la familia visual quedó dividida en dos: un builder libre real ya aterrizado en `MODULOS` y un layout white-label más guiado que sigue siendo específico del producto
- el builder libre ya cubre canvas, historial, JSON bridge, preview por dispositivo, widgets enlazables y presets visuales; lo que queda afuera es sobre todo wiring de persistencia y renderer público del reseller
- el puente JSON/GPT no es un detalle cosmético: es una señal fuerte de que este builder sirve como superficie de construcción asistida por IA y no solo como editor manual
