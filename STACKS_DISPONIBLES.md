# Stacks Disponibles

Fecha de corte: 2026-04-17

## stack-restaurante

- base: `restaurante`
- propósito: resolver restaurantes que combinan marca pública, menú/catálogo, ordering, delivery, reservas, pagos y operación interna
- blueprint fuente: `blueprints/blueprint-restaurante.md`
- casos de referencia: `rishtedar`, `truckpos_new`, `acargoo`, `donde-germain`
- módulos principales:
  - `food/food-engine-core`
  - `commerce/b2b-store-engine`
  - `commerce/cart-pricing-core`
  - `ops/food-ops-notification-core`
  - `cms/promotions-banner-engine`
  - `pos/product-importer`
  - `pos/table-service-core`
  - `pos/ticket-format-core`
  - `delivery/order-state-machine`
  - `delivery/pricing-core`
  - `delivery/tracking-core`
  - `crm/loyalty-ledger-core`
  - `intelligence/food-saturation-core`
  - `booking/agenda-core`
  - `booking/booking-locks`
  - `booking/booking-rubro-config-core`
  - `payments/mercadopago-core`
  - `payments/payment-gateway-router-core`
  - `notifications/dashboard-alerts-core`
  - `notifications/dispatch-kit`
  - `notifications/hospitality-email-core`
  - `notifications/push-notification-sw-core`
  - `pdf/tenant-branded-documents`

Lectura útil: este stack ya soporta catálogos vivos sembrados desde Excel, con categorización automática e imagen por SKU usando `pos/product-importer`.

## stack-delivery

- base: `delivery`
- propósito: resolver operaciones de despacho con pricing, tracking, estados, pagos y notificaciones
- blueprint fuente: `blueprints/blueprint-delivery.md`
- casos de referencia: `acargoo`, `rishtedar`
- módulos principales:
  - `delivery/order-state-machine`
  - `delivery/pricing-core`
  - `delivery/tracking-core`
  - `geo/route-planning-core`
  - `delivery/route-compliance-core`
  - `delivery/dispatch-ranking-core`
  - `delivery/toll-pricing-core`
  - `payments/mercadopago-core`
  - `pdf/pod-certificate-core`
  - `notifications/dispatch-kit`
  - `notifications/driver-subscription-core`
  - `notifications/order-update-message-core`
  - `notifications/order-update-email-core`
  - `pdf/tenant-branded-documents`

## stack-transporte-tracking

- base: `transporte-tracking`
- propósito: resolver recorridos visibles en mapa para terceros, con vehículo live, ETA, progreso y alertas operativas
- blueprint fuente: `blueprints/blueprint-transporte-tracking.md`
- casos de referencia: `acargoo`
- módulos principales:
  - `delivery/tracking-core`
  - `geo/route-planning-core`
  - `geo/map-surface-core`
  - `notifications/driver-subscription-core`
  - `notifications/dispatch-kit`
  - `notifications/dashboard-alerts-core`
  - `tenancy/tenant-config-core`

## stack-pos

- base: `pos`
- propósito: resolver catálogo, productos, operación food/POS, caja, inventario base y documentos operativos
- blueprint fuente: `blueprints/blueprint-pos.md`
- casos de referencia: `truckpos_new`, `rishtedar`
- módulos principales:
  - `pos/product-importer`
  - `pos/table-service-core`
  - `pos/ticket-format-core`
  - `food/food-engine-core`
  - `ops/food-ops-notification-core`
  - `ops/cash-close-alerts-core`
  - `ops/report-dataset-core`
  - `payments/mercadopago-core`
  - `pdf/tenant-branded-documents`

Lectura útil: sirve bien para negocios que actualizan catálogo por planilla y necesitan republicarlo sin tocar producto por producto.

Lectura útil extra: este stack también cubre menú público por QR y tracking web de pedido, así que ya no depende solo del terminal interno.

## stack-booking

- base: `booking`
- propósito: resolver agenda, reservas, locks transaccionales, checkout y documentos derivados
- blueprint fuente: `blueprints/blueprint-booking.md`
- casos de referencia: `rishtedar`
- módulos principales:
  - `booking/agenda-core`
  - `booking/booking-locks`
  - `booking/booking-rubro-config-core`
  - `payments/mercadopago-core`
  - `payments/zeleri-signature-core`
  - `payments/zeleri-oneshot-core`
  - `notifications/hospitality-email-core`
  - `pdf/tenant-branded-documents`

## stack-saas-multitenant

- base: `saas-multitenant`
- propósito: resolver productos multi-tenant con branding por cliente, límites, roles, pagos, soporte y CMS
- blueprint fuente: `blueprints/blueprint-saas-multitenant.md`
- casos de referencia: `superpanel3.0`, `pluscontable.cl`, `kurso`, `CorredoresPro`
- módulos principales:
  - `tenancy/tenant-config-core`
  - `tenancy/tenant-limits-core`
  - `tenancy/tenant-shell-core`
  - `tenancy/tenant-host-routing-core`
  - `factory/free-page-builder-core`
  - `access/credentials-encryption-core`
  - `access/worker-registration-link-core`
  - `payments/mercadopago-core`
  - `payments/payment-gateway-router-core`
  - `crm/support-inbox-core`
  - `portals/role-based-portals`
  - `cms/editable-content-core`
  - `ops/subscription-alerts-core`
  - `ops/monthly-credit-reset-core`
  - `ops/rate-limit-core`
  - `ops/weighted-cost-core`
  - `payments/currency-format-core`
  - `notifications/notification-preferences-core`
  - `pdf/honorarios-account-outline-core`
  - `pdf/social-security-report-outline-core`
  - `pdf/tenant-branded-documents`

## stack-crm-operativo

- base: `crm-operativo`
- propósito: resolver backoffice comercial y soporte con pipeline, inbox, seguimiento y superficies por rol
- blueprint fuente: `blueprints/blueprint-crm-operativo.md`
- casos de referencia: `hojacero`, `agendaproyectos`, `bizscout`, `CorredoresPro`
- módulos principales:
  - `crm/pipeline-board`
  - `crm/email-parsing-core`
  - `crm/outreach-message-core`
  - `crm/lead-hunting-core`
  - `crm/loyalty-ledger-core`
  - `crm/support-inbox-core`
  - `crm/demo-tracking-core`
  - `crm/growth-plan-core`
  - `crm/sales-agent-core`
  - `notifications/dashboard-alerts-core`
  - `notifications/dispatch-kit`
  - `notifications/whatsapp-template-kit`
  - `portals/role-based-portals`
  - `ops/project-workspace-core`
  - `ops/project-accounting-core`
  - `access/project-credentials-vault-core`

## stack-real-estate-operativo

- base: `real-estate-operativo`
- propósito: resolver corredoras multi-tenant con portales, contratos, mora y publicación externa
- blueprint fuente: `blueprints/blueprint-real-estate-operativo.md`
- casos de referencia: `CorredoresPro`
- módulos principales:
  - `portals/role-based-portals`
  - `integrations/property-publisher-core`
  - `geo/map-surface-core`
  - `notifications/whatsapp-template-kit`
  - `ops/arrears-alert-core`
  - `ops/chilean-utils-core`
  - `pdf/rental-contract-outline-core`
  - `pdf/tenant-branded-documents`

## stack-rrhh-documental

- base: `rrhh-documental`
- propósito: resolver onboarding de trabajadores, contratos laborales y trazabilidad de eventos RRHH por tenant
- blueprint fuente: `blueprints/blueprint-rrhh-documental.md`
- casos de referencia: `pluscontable.cl`
- módulos principales:
  - `tenancy/tenant-config-core`
  - `tenancy/tenant-shell-core`
  - `access/worker-registration-link-core`
  - `pdf/employment-contract-outline-core`
  - `pdf/service-quote-outline-core`
  - `pdf/honorarios-account-outline-core`
  - `pdf/social-security-report-outline-core`
  - `ops/worker-event-compensation-core`
  - `ops/chilean-utils-core`
  - `pdf/tenant-branded-documents`

## stack-loyalty-wallet

- base: `loyalty-wallet`
- propósito: resolver programas de fidelización multi-tenant con Google Wallet, geofencing, notificaciones y agenda híbrida
- blueprint fuente: `blueprints/blueprint-loyalty-wallet.md`
- casos de referencia: `fidelizacion`
- módulos principales:
  - `tenancy/tenant-config-core`
  - `tenancy/tenant-shell-core`
  - `tenancy/billing-plan-catalog-core`
  - `commerce/program-motor-config-core`
  - `crm/advisor-insights-core`
  - `crm/loyalty-ledger-core`
  - `integrations/google-wallet-pass-core`
  - `notifications/wallet-message-core`
  - `notifications/push-notification-sw-core`
  - `notifications/webpush-delivery-core`
  - `booking/booking-rubro-config-core`
  - `payments/flow-subscription-core`
