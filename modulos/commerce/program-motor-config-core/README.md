# program-motor-config-core

Normaliza la configuración de programas de fidelización por tipo (`sellos`, `cashback`, `multipase`, etc.) y soporta compatibilidad con estructuras legacy.

## Extraído de

- `fidelizacion/src/lib/motorConfig.ts`
- `fidelizacion/src/lib/programTypes.ts`

## Qué resuelve

- leer configs por motor aunque vengan en formato antiguo
- consolidar todas las configuraciones activas por tipo de programa
- reescribir el bloque `motors` de forma portable

## Estado

`usable inicial endurecido`

## Estado real

Ya tiene una base estable para leer y reescribir configuraciones legacy o modernas de motores de programa.
