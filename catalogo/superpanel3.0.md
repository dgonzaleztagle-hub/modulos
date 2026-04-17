# superpanel3.0

Repo origen: `D:\proyectos\superpanel3.0`

## Módulo: analytics visit tracker para demos

- taxonomía: `notificaciones y mensajería`
- rutas clave: `apps/reseller/src/components/analytics/visit-tracker.tsx`, `/api/demo-visits`
- problema que resuelve: clasificar y registrar visitas según superficie de la demo o panel
- alcance real observado: track de `landing`, `auth` y `dashboard` con post al backend
- dependencias externas: Next.js app router
- entidades y flujos principales: carga de página -> tipo de demo -> evento de visita
- señales de modularidad: componente mínimo y portable
- señales de acoplamiento o deuda: depende del routing interno y de un endpoint concreto
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: integración contable con AgendaProyectos

- taxonomía: `integraciones externas`
- rutas clave: `apps/reseller/src/lib/agenda-integration.ts`
- problema que resuelve: sincronizar pagos del reseller hacia un sistema externo de agenda/contabilidad de proyectos
- alcance real observado: búsqueda o creación de proyecto y alta de asiento contable de ingreso
- dependencias externas: Supabase externo, variables de entorno
- entidades y flujos principales: pago -> proyecto remoto -> accounting entry
- señales de modularidad: helper único y con responsabilidad clara
- señales de acoplamiento o deuda: hardcodea el proyecto `superpanel` y la empresa `CloudLab`
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: snapshot y backup de tenants reales

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `apps/reseller/scripts/backup-real-tenants.ts`
- problema que resuelve: capturar snapshots operativos de tenants/resellers reales con manifiesto y conteos por tabla
- alcance real observado: fetch paginado, backup por tabla, manifiesto JSON y resumen markdown
- dependencias externas: Node, Supabase service role, filesystem
- entidades y flujos principales: resellers objetivo -> tablas relacionadas -> snapshot -> manifiesto
- señales de modularidad: script de backup muy claro y portable como patrón
- señales de acoplamiento o deuda: los términos y tablas objetivo están definidos para un caso puntual (`gover/playzen`)
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: rate limit y ventana de expiración

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `apps/reseller/src/lib/rate-limit.ts`, `apps/reseller/src/lib/check-reseller-expirations.ts`, `apps/reseller/src/lib/check-expirations.ts`
- problema que resuelve: controlar abuso por endpoint y decidir checkpoints de vencimiento sin duplicar avisos
- alcance real observado: throttling en memoria, checkpoints 5/3/1/expired y deduplicación diaria
- dependencias externas: ninguna en la lógica base
- entidades y flujos principales: IP+endpoint -> intentos -> bloqueo temporal; fecha de vencimiento -> checkpoint -> alerta
- señales de modularidad: funciones puras y límites configurables, fáciles de portar
- señales de acoplamiento o deuda: la persistencia final de alertas depende del backend del reseller
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: formato monetario y costo ponderado

- taxonomía: `pagos y checkout`
- rutas clave: `apps/reseller/src/lib/currency.ts`, `apps/reseller/src/lib/credits-service.ts`
- problema que resuelve: formatear montos multi-moneda y calcular costo marginal de créditos sin contaminar planes con reset mensual
- alcance real observado: decimales por moneda, step HTML y weighted average cost con excepción para `MONTHLY_RESET`
- dependencias externas: ninguna
- entidades y flujos principales: currency -> formatter/input step; purchases -> costo promedio -> margen
- señales de modularidad: helpers puros y muy transferibles
- señales de acoplamiento o deuda: naming y contexto siguen orientados a créditos IPTV
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: preferencias de notificación y reset mensual de créditos

- taxonomía: `notificaciones y mensajería`
- rutas clave: `apps/reseller/src/lib/notifications-helper.ts`, `apps/reseller/src/lib/credits-service.ts`
- problema que resuelve: aplicar toggles por reseller y automatizar renovaciones mensuales de saldo con gasto operativo asociado
- alcance real observado: fallback seguro cuando no hay preferencias, reset mensual por `reset_day`, costo mensual separado del weighted cost
- dependencias externas: backend del reseller para la escritura final, pero no en la lógica base
- entidades y flujos principales: prefs -> allow/deny por canal; provider -> reset mensual -> gasto operativo
- señales de modularidad: políticas pequeñas, claras y con borde técnico estable
- señales de acoplamiento o deuda: el transporte final a transacciones y updates de base de datos sigue específico del producto
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: builder lab libre de páginas

- taxonomía: `CMS, landing y contenido`
- rutas clave: `apps/reseller/src/app/builder-lab/page.tsx`, `apps/reseller/src/components/builder-lab/*`, `apps/reseller/src/app/dashboard/config/actions.ts`
- problema que resuelve: construir superficies web libres con posicionamiento absoluto, inspector visual, widgets enlazables y publicación desde JSON
- alcance real observado: canvas drag-and-drop con `zustand`, historial undo/redo, preview desktop/tablet/mobile, inspector por elemento, toolbar de capas, presets visuales para botones, widgets de planes/servicios conectables a datos reales, puente JSON/GPT para importar/exportar diseños y guardado en `resellers.layout_config`
- dependencias externas: Next.js app router, Zustand, `@dnd-kit`, framer-motion, Supabase
- entidades y flujos principales: herramienta -> canvas -> item JSON -> inspector -> import/export -> guardado -> renderer público
- señales de modularidad: carpeta propia, store dedicado, componentes separados por shell/sidebar/canvas/renderer/inspector y acción de guardado aislada
- señales de acoplamiento o deuda: hoy comparte `layout_config` con otro linaje más seccional y eso mezcla dos contratos distintos en una misma columna; además la shell todavía no deja totalmente claro el cierre guardado/publicación del flujo libre y varios widgets siguen amarrados al catálogo reseller
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: layout seccional para landing white-label

- taxonomía: `CMS, landing y contenido`
- rutas clave: `apps/reseller/src/app/dashboard/builder/builder-client.tsx`, `apps/reseller/src/app/[slug]/public-landing-client.tsx`
- problema que resuelve: editar el orden, visibilidad, branding y bloques estándar de una landing pública por reseller
- alcance real observado: hero/promos/planes/servicios/features, theming, branding, preview responsive y publicación en ruta pública por `slug`
- dependencias externas: Next.js app router, Supabase, theming interno
- entidades y flujos principales: reseller config -> layout seccional -> preview -> landing pública por `slug`
- señales de modularidad: flujo claro para casos white-label y renderer estable basado en `block.type`
- señales de acoplamiento o deuda: está muy amarrado al producto reseller y no es realmente libre; además colisiona conceptualmente con el builder lab al compartir `layout_config`
- madurez estimada: `alto`
- potencial de reutilización: `medio`
- observación de extracción: `requiere refactor`
