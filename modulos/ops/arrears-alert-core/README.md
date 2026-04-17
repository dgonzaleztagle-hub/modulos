# arrears-alert-core

Helpers portables para agrupar mora por contrato, clasificar severidad y resumir alertas operativas.

## Qué resuelve

- detecta pagos vencidos o pendientes con fecha pasada
- agrupa contratos por mayor antigüedad de deuda
- clasifica severidad en warning, alert y critical
- arma resumen de morosidad y mensaje legal operativo

## Origen

- `CorredoresPro/src/lib/supabase-helpers.ts`
- `CorredoresPro/src/components/MorosidadAlerts.tsx`

## Estado

`usable inicial endurecido`


## Estado real

Ya resuelve mora, severidad y redacción base con suficiente estabilidad para carteras y cobranza.
