# expiration-window-core

Normaliza ventanas de expiración y checkpoints de aviso (`5`, `3`, `1` días y vencido) para notificaciones operativas.

## Extraído de

- `superpanel3.0/apps/reseller/src/lib/check-expirations.ts`
- `superpanel3.0/apps/reseller/src/lib/utils/date-utils.ts`

## Qué resuelve

- calcular días restantes de forma consistente
- decidir cuándo corresponde aviso preventivo o expiración
- desacoplar la regla temporal del acceso a Supabase


## Estado

`usable inicial endurecido`


## Estado real

Ya abstrae ventanas y checkpoints de vencimiento con un contrato simple y portable.
