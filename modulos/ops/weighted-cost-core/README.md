# weighted-cost-core

Calcula costo promedio ponderado y costo marginal para esquemas de créditos o saldo reseller.

## Extraído de

- `superpanel3.0/apps/reseller/src/lib/utils/cost-calculator.ts`

## Qué resuelve

- obtener costo promedio por crédito sin acoplarse a Supabase
- tratar planes `MONTHLY_RESET` como costo marginal cero
- reutilizar la lógica financiera en ventas, dashboard o pricing


## Estado

`usable inicial endurecido`


## Estado real

Ya resuelve costo ponderado y márgenes con una base portable y clara.
