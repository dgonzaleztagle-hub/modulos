# ticket-format-core

Helpers portables para formatear tickets de caja y cocina en flujos food/POS.

## Qué resuelve

- label consistente por tipo de pedido
- label de método de pago
- total de productos en ticket de cocina

## Origen

- `truckpos_new/src/components/pos/KitchenTicket.tsx`
- `truckpos_new/src/components/pos/PrintTicket.tsx`

## Estado

`usable inicial endurecido`

## Estado real

Ya encapsula la parte portable de labels y conteos de ticket, suficiente para no depender de la UI de cocina o caja original.
