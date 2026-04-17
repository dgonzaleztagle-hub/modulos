# table-service-core

Helpers portables para operación de mesas: estado visible, total acumulado y plan de movimiento de pedidos entre mesas.

## Qué resuelve

- labels de estado para mesas
- cálculo del total por mesa
- plan portable para mover una orden y liberar/ocupar mesas

## Origen

- `truckpos_new/src/pages/Tables.tsx`

## Estado

`usable inicial endurecido`

## Estado real

Ya tiene borde portable claro para operación de mesas y movimiento de pedidos, suficiente para no volver a depender de la pantalla original de POS.
