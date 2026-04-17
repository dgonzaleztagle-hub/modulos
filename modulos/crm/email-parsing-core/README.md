# email-parsing-core

Utilidades portables para decodificar correos crudos, extraer cuerpo legible y normalizar remitentes.

## Qué resuelve

- decodificación de correos `multipart`
- soporte para `base64` y `quoted-printable`
- limpieza de HTML, headers de transporte y ruido MIME
- extracción portable de identidad del remitente

## Origen

- `hojacero/lib/inbox/emailParsing.ts`

## Estado

`usable inicial endurecido`


## Estado real

Ya concentra parsing de correos y remitentes con un borde claro para integrar inboxes o ingestión automatizada.
