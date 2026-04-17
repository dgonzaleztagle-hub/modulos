# dashboard-alerts-core

Helpers portables para sintetizar alertas de dashboard y su configuración sonora.

## Qué resuelve

- define tono por tipo de alerta
- arma payloads legibles para pedidos, reservas y delivery
- centraliza labels y severidad visual ligera para dashboards operativos

## Origen

- `rishtedar/hooks/useRealtimeAlerts.ts`

## Estado

`usable inicial endurecido`

## Estado real

Ya centraliza una salida consistente para alertas operativas y su tono, suficiente para reutilizarlo en dashboards sin volver a recrear copy y severidad.
