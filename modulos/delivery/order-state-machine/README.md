# delivery/order-state-machine

Estado: usable inicial endurecido

## Origen

- `D:\proyectos\acargoo\lib\acargoo\domain\state-machine.ts`

## Propósito

Validar transiciones entre estados de una orden de delivery o despacho.

## Diseño tomado

- no se fija a un set único de estados
- permite crear máquinas por configuración
- incluye helper para validar y helper para lanzar error

## Pendiente

- agregar presets por vertical: carga, food delivery, reservas con tracking
- agregar metadata opcional por transición


## Estado real

Ya tiene un flujo portable y suficiente borde técnico para pedidos con cambios de estado controlados.
