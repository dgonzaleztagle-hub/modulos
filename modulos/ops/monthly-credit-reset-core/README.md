# monthly-credit-reset-core

Motor portable para detectar proveedores con reset mensual de créditos y preparar el cambio de saldo junto a su gasto operativo asociado.

## Qué resuelve

- decide si un proveedor debe resetear créditos hoy
- arma candidatos de reset con saldo anterior y nuevo
- genera metadata portable para registrar el reset
- prepara el gasto mensual sin contaminar el costo marginal de créditos

## Origen

- `superpanel3.0`

## Estado

`usable inicial endurecido`

## Estado real

Ya resuelve bien el lote portable de reset mensual y su gasto asociado, sin contaminar la lógica de ejecución real.
