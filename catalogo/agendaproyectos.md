# agendaproyectos

Repo origen: `D:\proyectos\agendaproyectos`

## Módulo: project workspace operativo

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/pages/ProjectDetails.tsx`, `src/components/project-tabs.tsx`, `src/types/index.ts`
- problema que resuelve: centralizar la operación de un proyecto con tabs de clientes, pagos, notas, tareas y credenciales
- alcance real observado: dashboard por proyecto con persistencia en un campo `data` del registro principal
- dependencias externas: React Router, Supabase
- entidades y flujos principales: proyecto -> workspace tabulado -> actualización persistida
- señales de modularidad: estructura bien delimitada por tabs funcionales
- señales de acoplamiento o deuda: varias piezas viven dentro de un único blob de datos y no como dominios separados
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: workspace JSON unificado por proyecto

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/pages/ProjectDetails.tsx`, `src/components/project-tabs.tsx`, `src/types/index.ts`, `supabase_schema.sql`
- problema que resuelve: concentrar operación, seguimiento, contabilidad liviana y vault de un proyecto en una sola ficha persistible
- alcance real observado: la app actual ya no opera con tablas separadas para contabilidad/brainstorm/credenciales; usa un blob `data` único con tabs funcionales sobre el mismo documento
- dependencias externas: Supabase como storage del registro `projects`
- entidades y flujos principales: proyecto -> data embebida -> tabs métricas/contabilidad/ideas/credenciales -> persistencia unificada
- señales de modularidad: shape claro de `ProjectData`, defaults consistentes y edición tabulada por dominio
- señales de acoplamiento o deuda: el blob concentra demasiadas responsabilidades y no tiene versionado ni validación fuerte
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: accounting tab para proyectos

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `src/components/tabs/accounting-tab.tsx`
- problema que resuelve: registrar clientes, pagos, cuotas de implementación y métricas rápidas de ingresos
- alcance real observado: CRUD liviano de clientes/pagos con proyección e historial
- dependencias externas: ninguna compleja más allá del frontend actual
- entidades y flujos principales: cliente -> pago -> ingresos/proyección
- señales de modularidad: tab autocontenida y con tipos propios
- señales de acoplamiento o deuda: no está separada como librería y depende del shape de `ProjectData`
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: credentials tab / vault liviano

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/components/tabs/credentials-tab.tsx`
- problema que resuelve: asociar credenciales operativas a proyectos sin salir del workspace central
- alcance real observado: almacenamiento de credenciales como parte de la ficha del proyecto
- dependencias externas: Supabase
- entidades y flujos principales: proyecto -> credenciales -> consulta operativa
- señales de modularidad: dominio reconocible aunque pequeño
- señales de acoplamiento o deuda: hoy es un vault liviano embebido dentro del proyecto, no un submódulo aislado
- madurez estimada: `medio`
- potencial de reutilización: `medio`
- observación de extracción: `solo referencia`

## Módulo: normalización de workspace por proyecto

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/pages/ProjectDetails.tsx`, `src/components/project-tabs.tsx`, `src/types/index.ts`
- problema que resuelve: asegurar que todo proyecto arranque con un blob operativo consistente aunque la data venga incompleta
- alcance real observado: defaults para clientes, pagos, notas, tareas y credenciales, con criterio de `last activity`
- dependencias externas: ninguna en la lógica extraíble
- entidades y flujos principales: proyecto -> data parcial -> workspace normalizado
- señales de modularidad: reglas chicas, puras y estables
- señales de acoplamiento o deuda: el shape sigue atado a la estructura del workspace interno
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: métricas y registros contables por proyecto

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `src/components/tabs/accounting-tab.tsx`, `src/types/index.ts`
- problema que resuelve: crear clientes/pagos y calcular ingresos rápidos dentro de un proyecto interno
- alcance real observado: totalRevenue, activeClients y pagos con cuotas de implementación
- dependencias externas: ninguna en la lógica base
- entidades y flujos principales: cliente -> pago -> totalRevenue/proyección
- señales de modularidad: todo el corazón útil es puro y portable
- señales de acoplamiento o deuda: la proyección mensual sigue mínima y la UI original hace parte del trabajo
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: project credentials vault

- taxonomía: `auth y tenants`
- rutas clave: `src/components/tabs/credentials-tab.tsx`, `src/types/index.ts`
- problema que resuelve: manejar credenciales operativas por proyecto con vendors conocidos y entradas custom
- alcance real observado: GitHub, Supabase, Vercel y custom secrets con CRUD liviano
- dependencias externas: ninguna en la lógica extraíble
- entidades y flujos principales: proyecto -> vault -> credencial custom o vendor
- señales de modularidad: el modelo y los CRUD son muy claros
- señales de acoplamiento o deuda: el cifrado real no existe aún; es vault liviano, no secreto fuerte
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: dashboard consolidado por portafolio de proyectos

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/pages/Dashboard.tsx`, `src/components/dashboard-metrics.tsx`, `src/components/project-card.tsx`
- problema que resuelve: ver ingresos y desglose consolidado de varios proyectos internos desde un mismo hub
- alcance real observado: suma implementación, MRR, ARR y ranking de ingresos por proyecto/empresa
- dependencias externas: ninguna compleja fuera de Supabase para lectura
- entidades y flujos principales: proyectos -> pagos embebidos -> consolidado financiero -> ranking por proyecto
- señales de modularidad: reglas puras de agregación fáciles de separar de la UI
- señales de acoplamiento o deuda: la segmentación por empresa sigue hardcodeada a `Lovable` y `CloudLab`
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`
