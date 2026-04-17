# Caso: Rishtedar

## Tipo

Restaurante con mezcla de:

- sitio/branding
- menú y ordering
- delivery
- reservas
- dashboard operativo
- promos / loyalty

## Lectura ejecutiva

`Rishtedar` representa exactamente el problema que motivó `MODULOS`:
había que construir un restaurante nuevo reutilizando piezas que estaban repartidas entre varios repos y varios experimentos.

## Qué se necesitó

- experiencia restaurante y marca
- ordering flow
- delivery con tracking
- reservas y operación diaria
- dashboard interno
- pagos

## De dónde salió valor

### Desde `truckpos_new`

- POS mental model
- importación / catálogo
- servicio de mesas y movimiento de órdenes
- formateo de tickets de cocina y cliente
- caja / inventario / reportes como referencia operativa

### Desde `acargoo`

- lógica de delivery más madura
- pricing
- state machine
- tracking

### Desde `hojacero/app/prospectos/donde-germain`

- aprendizaje de branding food
- sensación de marca más agresiva / urbana
- ideas de surface pública, game y tracking web

### Desde `rishtedar` mismo

- ensamblaje final restaurante
- reservas
- dashboard operativo
- scanner
- loyalty/promotions

## Qué módulos mirar hoy si llega otro restaurante

- `modulos/delivery/order-state-machine`
- `modulos/delivery/pricing-core`
- `modulos/delivery/tracking-core`
- `modulos/commerce/b2b-store-engine`
- `modulos/commerce/cart-pricing-core`
- `modulos/pos/product-importer`
- `modulos/pos/table-service-core`
- `modulos/pos/ticket-format-core`
- `modulos/payments/mercadopago-core`
- `modulos/payments/payment-gateway-router-core`
- `modulos/booking/agenda-core`
- `modulos/booking/booking-locks`
- `modulos/booking/booking-rubro-config-core`
- `modulos/food/food-engine-core`
- `modulos/notifications/dashboard-alerts-core`
- `modulos/notifications/dispatch-kit`
- `modulos/cms/promotions-banner-engine`

## Qué mirar además como referencia

- `catalogo/rishtedar.md`
- `catalogo/truckpos_new.md`
- `catalogo/acargoo.md`
- `casos/donde-germain.md`

## Qué no conviene repetir

- volver a explorar todos los repos completos
- mezclar desde el inicio branding, delivery y POS sin separar piezas
- copiar dashboards enteros antes de definir qué necesita el cliente

## Regla práctica

Para un nuevo restaurante:

1. abrir `blueprint-restaurante.md`
2. revisar este caso
3. elegir módulos
4. solo si falta algo volver al catálogo
