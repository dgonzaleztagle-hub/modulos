# notification-preferences-core

Motor portable para resolver preferencias de notificación por tenant, reseller o usuario sin depender del backend original.

## Qué resuelve

- responde si una categoría de notificación está habilitada
- aplica fallback seguro cuando la preferencia no existe
- mezcla preferencias base con overrides
- lista las categorías habilitadas para una superficie

## Origen

- `superpanel3.0`

## Estado

`usable inicial endurecido`

## Estado real

Ya resuelve la capa portable de gating por preferencias y overrides, suficiente para varios stacks multi-tenant y operativos.
