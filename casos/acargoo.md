# Caso: Acargoo

## Tipo

Delivery / despacho / logística

## Valor principal encontrado

- pricing más claro
- state machine de órdenes
- tracking
- peajes / cumplimiento de ruta
- POD PDF

## Qué piezas aporta al sistema MODULOS

- `delivery/order-state-machine`
- `delivery/pricing-core`
- parte de `delivery/tracking-core`
- `geo/route-planning-core`
- `delivery/toll-pricing-core`
- `delivery/route-compliance-core`
- `notifications/dispatch-kit`
- `notifications/driver-subscription-core`
- `notifications/order-update-message-core`
- `notifications/order-update-email-core`
- `pdf/pod-certificate-core`
- `pdf/tenant-branded-documents`

## Cuándo abrir este caso

- cuando el proyecto tenga reparto, courier o despacho
- cuando se necesite estado de orden serio y no solo “pedido hecho”

## Qué no hacer

- no copiar su superficie completa admin/b2b/driver si el nuevo proyecto no lo necesita
- separar siempre core logístico de UI producto
