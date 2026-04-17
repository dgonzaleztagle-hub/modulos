# webpush-delivery-core

Core portable para preparar delivery de web push desde servidor, resolver audiencia por tenant/cliente y separar subscripciones vencidas de errores reintentables.

## Qué resuelve

- normalización de payloads de push
- filtrado de audiencias por tenant y cliente
- serialización del body a enviar por integradores tipo `web-push`
- clasificación de resultados `delivered / expired / retryable`
- limpieza de subscripciones vencidas sin mezclar transporte ni base de datos

## Origen

- `fidelizacion/src/lib/webpush.ts`

## Estado

`usable inicial endurecido`

## Estado real

Ya cubre payload, audiencia y clasificación de resultados con suficiente borde técnico para integrarlo en delivery o fidelización sin rehacer la lógica.
