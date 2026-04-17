# driver-subscription-core

Helpers portables para normalizar, listar y mantener suscripciones push por chofer.

## Qué resuelve

- sanea payloads de `PushSubscription`
- extrae suscripciones válidas por chofer
- inserta sin duplicar por endpoint
- remueve suscripciones obsoletas

## Origen

- `acargoo/lib/acargoo/domain/driver-push.ts`

## Estado

`usable inicial endurecido`

## Estado real

Ya tiene borde técnico pequeño pero firme: sanea, deduplica, lista y limpia suscripciones sin depender de un runtime específico.
