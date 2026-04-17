# honorarios-account-outline-core

Normaliza el contenido reusable de un estado de cuenta de honorarios: cliente, período, totales, saldo previo y mensaje de cobranza.

## Extraído de

- `pluscontable.cl/src/lib/honorariosPdfGenerator.ts`

## Qué resuelve

- separar el estado financiero del render PDF
- reutilizar la misma lógica en dashboard, correo, PDF o panel de cobranza
- unificar rotulación de estados `pagado`, `parcial` y `pendiente`


## Estado

`usable inicial endurecido`


## Estado real

Ya consolida estructura y resumen de cuenta de honorarios con borde portable.
