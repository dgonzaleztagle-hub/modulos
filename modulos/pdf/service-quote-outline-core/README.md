# service-quote-outline-core

Genera una estructura portable para cotizaciones de servicios: destinatario, propuesta, detalle valorizado, resumen económico y metadata de emisión/validez.

## Extraído de

- `pluscontable.cl/src/lib/cotizacionServicioPdfGenerator.ts`

## Qué resuelve

- separar el contenido reusable de una propuesta comercial del render final en PDF
- recalcular subtotales e IVA cuando el origen no los entrega cerrados
- permitir reutilizar la cotización en viewer, exportes o adapters distintos a `jsPDF`


## Estado

`usable inicial endurecido`


## Estado real

Ya entrega una estructura estable para propuestas comerciales y cotizaciones de servicio.
