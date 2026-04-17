# Registry

## Objetivo

Dar una capa legible por máquina para:

- listar módulos y su estado
- saber qué módulos recomienda cada blueprint
- recordar qué combinaciones usó cada caso
- resolver un stack inicial por vertical o por capacidad

## Archivos

- `modulos-registry.json`: fuente central estructurada
- `..\scripts\resolve-stack.ps1`: consulta rápida para uso operativo

## Regla práctica

Si la pregunta es:

- "qué tenemos para restaurantes"
- "qué módulos cubren delivery y pagos"
- "qué caso se parece a este cliente"

primero usar `registry/` y después abrir los `.md`.
