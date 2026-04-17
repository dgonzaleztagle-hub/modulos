# zeleri-oneshot-core

Core reusable para checkout `one-shot` con Zeleri.

## Qué resuelve

- sanea `baseUrl`, `token` y `secret`
- arma el payload de orden `one-shot`
- firma el request con `HMAC-SHA256`
- genera el request portable para `POST /v1/checkout/orders`
- genera el request portable para `GET /v1/orders/detail`
- normaliza y clasifica estados pagados

## Origen

- `zeus/src/lib/zeleri.ts`
- `zeus/src/app/api/zeus/book/route.ts`

## Uso mental

La idea es simple: por comercio solo cambias `baseUrl`, `token` y `secret`.
El resto del flujo queda estable.

## Estado

`usable inicial endurecido`

## Estado real

Ya concentra el flujo one-shot reutilizable con saneo de credenciales, armado de requests y clasificación de estados sin depender de una app concreta.
