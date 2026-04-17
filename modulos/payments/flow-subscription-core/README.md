# flow-subscription-core

Modela la parte reusable de Flow para planes, clientes, suscripciones y firma de parámetros.

## Extraído de

- `fidelizacion/src/lib/flow.ts`

## Qué resuelve

- firmar payloads Flow en forma portable
- generar requests determinísticas para planes, customers y subscriptions
- desacoplar la firma HMAC y el armado de parámetros del transporte HTTP real


## Estado

`usable inicial endurecido`


## Estado real

Ya separa firma y payloads de Flow con un contrato estable para suscripciones.
