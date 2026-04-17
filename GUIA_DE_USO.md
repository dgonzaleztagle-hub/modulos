# Guía de uso de MODULOS

## Objetivo

Usar `MODULOS` como memoria operativa para construir nuevos proyectos sin volver a explorar todos los repos históricos.

## Cómo usarlo cuando llegue un proyecto nuevo

### 1. Identificar el tipo de proyecto

Preguntas rápidas:

- ¿es restaurante?
- ¿es delivery?
- ¿es POS?
- ¿es SaaS multi-tenant?
- ¿es CRM/backoffice?
- ¿es agenda/reservas?

### 2. Abrir el blueprint correcto

Ejemplos:

- restaurante: `blueprints/blueprint-restaurante.md`
- delivery: `blueprints/blueprint-delivery.md`
- POS: `blueprints/blueprint-pos.md`
- booking: `blueprints/blueprint-booking.md`
- SaaS: `blueprints/blueprint-saas-multitenant.md`

Si quieres un atajo operativo, usar:

- `scripts/resolve-stack.ps1 -Blueprint restaurante -IncludeModules -IncludeCases`
- `scripts/resolve-stack.ps1 -Capability delivery,pagos -IncludeModules -IncludeCases`
- `npm run viewer`

### 2.1 Si quieres verlo como panel

Levantar el explorer visual local:

1. entrar a `D:\proyectos\MODULOS`
2. correr `npm run viewer`
3. abrir `http://localhost:4173`

El panel ya incluye:

- explorer de módulos, casos y blueprints
- stack builder para elegir vertical + capacidades
- propuesta inicial de módulos y referencias
- brief técnico inicial copiable

### 3. Revisar casos parecidos

Antes de mirar código, revisar `casos/`.

Esto responde:

- qué combinación ya funcionó
- qué módulos se usaron
- qué se descartó
- de qué repos vinieron las piezas

### 4. Recién después revisar `modulos/`

Abrir solo los módulos que el blueprint o el caso recomiende.

### 5. Si necesitas resolver rápido, mirar `registry/`

`registry/modulos-registry.json` ya deja mapeado:

- qué módulos recomienda cada vertical
- qué casos se parecen
- qué capacidades cubre cada módulo

### 6. Si falta algo, volver al `catalogo/`

`catalogo/` es la capa de arqueología controlada.
No se parte por ahí salvo que el caso y el blueprint no alcancen.

## Orden de lectura recomendado

1. `MANIFIESTO.md`
2. `registry/...`
3. `viewer/...`
4. `blueprints/...`
5. `casos/...`
6. `modulos/...`
7. `catalogo/...`

## Regla práctica

No preguntar “qué hay en todos los repos”.
Preguntar:

- qué blueprint aplica
- qué caso se parece
- qué módulos concretos necesitamos

## Casos de uso esperados

### Caso: nuevo restaurante

- abrir `blueprint-restaurante.md`
- revisar `casos/rishtedar.md`
- revisar `casos/truckpos_new.md`
- tomar módulos de POS, delivery, pagos, agenda y branding

### Caso: nuevo delivery

- abrir `blueprint-delivery.md`
- revisar `casos/acargoo.md`
- tomar pricing, state machine, tracking y pagos

### Caso: nuevo SaaS multi-tenant

- abrir `blueprint-saas-multitenant.md`
- revisar `pluscontable.cl`, `kurso`, `CorredoresPro` en catálogo
- tomar tenancy, payments, support inbox y role-based portals
