# rate-limit-core

Entrega una base portable para rate limiting in-memory: llave por IP+endpoint, evaluación de ventana y pruning de registros expirados.

## Extraído de

- `superpanel3.0/apps/reseller/src/lib/rate-limit.ts`

## Qué resuelve

- proteger login o endpoints sin depender del store concreto
- reutilizar la lógica de ventana/contador en memoria o en Redis
- separar la regla del transporte HTTP

## Estado

`usable inicial endurecido`

## Estado real

Ya entrega una base compacta y estable para rate limiting portable con ventana y pruning, lista para adaptarse a memoria o Redis.
