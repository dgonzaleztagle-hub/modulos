# payment-gateway-router-core

Router portable para construir payloads y endpoints de pago para Mercado Pago, Flow y Transbank.

## Qué resuelve

- validación mínima de credenciales por gateway
- armado portable de payloads para checkout
- resolución consistente de endpoint y URL final de checkout

## Origen

- `hojacero/lib/store/payment-gateways.ts`

## Estado

`usable inicial endurecido`

## Estado real

Ya entrega un contrato estable para rutear pagos entre gateways distintos sin acoplar la app al SDK o endpoint final de cada proveedor.
