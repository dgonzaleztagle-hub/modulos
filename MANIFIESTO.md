# Manifiesto de MODULOS

Fecha de corte: 2026-04-17

## Qué es este repo

`MODULOS` es la base autónoma de piezas reutilizables del ecosistema de `D:\proyectos`.

No es un mapa preliminar ni una libreta de hallazgos.

Su estructura final es esta:

- `modulos/`: reusable real
- `blueprints/`: ensamblajes por vertical
- `casos/`: combinaciones ya probadas
- `registry/`: verdad formal legible por máquina
- `viewer/`: puerta de entrada humana
- `catalogo/`: cantera histórica y referencias finales

## Qué significan los estados

- `usable inicial endurecido`: módulo reusable con borde claro y validación mínima
- `referencia final`: familia o wrapper documentado que se conserva como linaje, no como core portable actual

## Regla central

La verdad del repo no se decide leyendo carpetas al azar.

La verdad sale de la consistencia entre:

- `registry/`
- `viewer/`
- `blueprints/`
- `casos/`
- `modulos/`

## Alcance final

`MODULOS` queda listo para:

- arrancar proyectos nuevos desde stacks reales
- ubicar rápido módulos madre por vertical o capacidad
- distinguir reusable serio de referencia histórica
- trabajar sin depender mentalmente de `hojacero`, `acargoo`, `truckpos_new` u otros repos origen

## Decisión ejecutiva final

Desde este cierre:

- el scanning queda clausurado
- `modulos/` pasa a ser punto de partida real
- `catalogo/` deja de empujar trabajo nuevo por sí mismo
- los repos viejos quedan como cantera histórica, no como fuente operativa diaria
