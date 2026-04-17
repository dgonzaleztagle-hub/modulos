# snapshot-toolkit

Utilidades portables para snapshots operativos, backups por tablas y manifiestos de captura.

## Qué cubre

- chunking de IDs
- deduplicación por id
- conteos por tabla
- manifiesto de snapshot

## Qué no cubre

- acceso real a base de datos
- subida de backups
- cifrado

## Estado

`usable inicial endurecido`

## Estado real

Ya cubre la parte portable de manifests, chunks y deduplicación para snapshots operativos sin depender del backend original.
