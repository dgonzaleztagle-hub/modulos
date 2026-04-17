# payments/mercadopago-core

Estado: usable inicial endurecido

## Fuentes

- `rishtedar`
- `pluscontable.cl`
- `kurso/remix-of-pagos-pre-kinder-b`
- `zeus`
- `truckpos_new`

## Propósito

Unificar checkout, webhook y consulta de estado de Mercado Pago para productos transaccionales y SaaS.

## Qué resuelve hoy

- normalización de estados de Mercado Pago
- normalización de eventos/webhooks
- validación y armado de checkout intent portable
- helpers para saber si un pago quedó aprobado o finalizado
- armado de back URLs y notification URL
- extracción de `paymentId` y referencias scopeadas desde webhooks
- helpers de `payer` para nombre y fallback de email local

## Estado real

Ya tiene código reusable inicial.
Todavía falta endurecer adapters concretos por SDK y proveedores de infraestructura.
