# blueprint-restaurante

## Objetivo

Resolver restaurantes que combinan:

- marca pública
- menú / catálogo
- ordering
- delivery
- reservas
- operación interna

## Orden recomendado

### Capa 1: experiencia pública

- referencia: `casos/donde-germain.md`
- apoyo: `catalogo/hojacero.md`
- `modulos/cms/promotions-banner-engine`
- `modulos/notifications/push-notification-sw-core`

### Capa 2: operación food / POS

- `modulos/pos/product-importer`
- `modulos/pos/table-service-core`
- `modulos/pos/ticket-format-core`
- `modulos/food/food-engine-core`
- `modulos/commerce/b2b-store-engine`
- `modulos/commerce/cart-pricing-core`
- `modulos/ops/food-ops-notification-core`
- referencia: `casos/truckpos_new.md`

### Capa 3: delivery

- `modulos/delivery/order-state-machine`
- `modulos/delivery/pricing-core`
- `modulos/delivery/tracking-core`
- `modulos/crm/loyalty-ledger-core`
- `modulos/intelligence/food-saturation-core`
- referencia: `casos/acargoo.md`

### Capa 4: reservas y agenda

- `modulos/booking/agenda-core`
- `modulos/booking/booking-locks`
- `modulos/booking/booking-rubro-config-core`

### Capa 5: pagos y notificaciones

- `modulos/payments/mercadopago-core`
- `modulos/payments/payment-gateway-router-core`
- `modulos/notifications/dashboard-alerts-core`
- `modulos/notifications/dispatch-kit`
- `modulos/notifications/hospitality-email-core`
- `modulos/notifications/push-notification-sw-core`
- `modulos/pdf/tenant-branded-documents`

### Capa 6: fidelización y crecimiento

- `modulos/crm/loyalty-ledger-core`
- `modulos/cms/promotions-banner-engine`

## Caso de referencia principal

- `casos/rishtedar.md`

## Checklist de uso

- ¿hay delivery real o solo pickup?
- ¿hay reservas o solo ordering?
- ¿hay caja / inventario / cocina?
- ¿hay dashboard operativo?
- ¿hay necesidad de loyalty o scanner?
- ¿hay necesidad de catálogo técnico/cotizable además del menú tradicional?

## Qué evitar

- partir por UI antes de definir el mix real de operación
- volver a abrir `truckpos`, `acargoo`, `rishtedar` y `donde-germain` completos sin pasar por este blueprint
