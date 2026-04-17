# MODULOS

Memoria operativa y técnica de módulos reutilizables detectados y aterrizados desde los repos de `D:\proyectos`.

## Propósito

Este workspace ya cumple cuatro funciones:

- consolidar módulos reutilizables ya absorbidos desde repos históricos
- recordar soluciones reales ya ensambladas
- seleccionar stacks sin volver a explorar todo desde cero
- dejar explícitas las pocas familias que quedan solo como referencia final

## Estructura

- `catalogo/`: cantera histórica y referencias finales ya cerradas
- `comparativos/`: cruces entre repos, equivalencias y priorización
- `casos/`: soluciones reales ya ensambladas
- `blueprints/`: recetas por vertical
- `modulos/`: módulos aterrizados o listos para endurecer
- `registry/`: capa legible por máquina para resolver stacks y referencias
- `viewer/`: explorer visual local para recorrer el repo
- `scripts/`: utilidades de verificación y resolución rápida

## Taxonomía usada

- auth y tenants
- pagos y checkout
- delivery y tracking
- reservas y agenda
- POS y operación
- CRM, pipeline y backoffice
- IA, chat y automatización
- notificaciones y mensajería
- CMS, landing y contenido
- reportes, PDFs y exportación
- geo, mapas y territorial
- integraciones externas

## Repos analizados

- `hojacero`
- `acargoo`
- `agendaproyectos`
- `bizscout`
- `fidelizacion`
- `rishtedar`
- `truckpos_new`
- `pluscontable.cl`
- `kurso/remix-of-pagos-pre-kinder-b`
- `zeus`
- `CorredoresPro`
- `superpanel3.0`

`truckPos` quedó fuera del análisis profundo inicial porque en esta pasada solo expone `_management_data`.

## Cómo navegar el repo

Orden sugerido:

1. `MANIFIESTO.md`
2. `PLAN_VIVO.md`
3. `GUIA_DE_USO.md`
4. `STACKS_DISPONIBLES.md`
5. `registry/`
6. `viewer/`
7. `blueprints/`
8. `casos/`
9. `modulos/`
10. `catalogo/`

## Estado actual

- el scanning raíz ya quedó cerrado
- el inventario principal está consolidado en `registry/`
- existen `97` módulos endurecidos y `3` referencias finales explícitas
- los comparativos base están cerrados
- existen casos reales navegables
- existen blueprints por vertical
- existe un registro central para seleccionar módulos, casos y blueprints
- existe un explorer visual local para lectura humana rápida
- existe un stack builder visual para proponer combinaciones iniciales
- el repo ya se entiende como base autónoma, con `catalogo/` solo como cantera histórica
