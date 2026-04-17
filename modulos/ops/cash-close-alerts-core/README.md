# cash-close-alerts-core

Helpers portables para calcular alertas de cierre de caja por ventana horaria.

## Qué resuelve

- parsea horario `HH:mm`
- calcula minutos restantes al cierre
- resuelve etapa de alerta operativa

## Origen

- `truckpos_new/src/hooks/useCashCloseReminder.tsx`

## Estado

`usable inicial endurecido`

## Estado real

Ya resuelve la lógica reusable de ventana y etapas de alerta para cierres de caja sin amarrarse a un hook o pantalla concreta.
