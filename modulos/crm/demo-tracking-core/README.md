# demo-tracking-core

Core portable para trackear visitas a demos, distinguir equipo interno y resumir conteos por prospecto.

## Qué resuelve

- valida slugs de demos/prospectos
- genera fingerprint browser simple sin cookies
- arma payload de tracking desde pathname
- agrega conteos de visitas no internas
- construye email de notificación de visita

## Origen

- `hojacero/components/tracking/DemoTracker.tsx`
- `hojacero/app/api/tracking/*`

## Estado

`usable inicial endurecido`

## Estado real

Ya concentra la parte portable de visitas, fingerprint y notificación de demo sin quedar pegado al tracker original.
