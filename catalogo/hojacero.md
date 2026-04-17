# hojacero

Repo origen: `D:\proyectos\hojacero`

## Módulo: agenda operativa

- taxonomía: `reservas y agenda`
- rutas clave: `components/agenda/AgendaCalendar.tsx`, `EventModal.tsx`, `app/api/agenda/*`, `app/dashboard/agenda`
- problema que resuelve: programar eventos, disponibilidad y recordatorios desde panel interno
- alcance real observado: calendario, modal de evento y APIs de disponibilidad/eventos/reminder
- dependencias externas: Next.js, Supabase
- entidades y flujos principales: disponibilidad -> evento -> recordatorio
- señales de modularidad: UI y API claramente agrupadas por dominio
- señales de acoplamiento o deuda: lógica repartida entre app dashboard y APIs
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: agenda email y reminder routing

- taxonomía: `notificaciones y mensajería`
- rutas clave: `app/api/agenda/events/route.ts`, `app/api/agenda/reminder/route.ts`
- problema que resuelve: avisar creación de reunión y enviar recordatorios internos según responsable y ventana de tiempo
- alcance real observado: routing de destinatarios por responsable, ventana 30-35 minutos, payload HTML/texto de reminder y aviso de nueva reunión
- dependencias externas: Resend en origen; el core portable es la lógica de destinatarios, ventanas y contenido
- entidades y flujos principales: evento agenda -> responsable -> recordatorio/notificación -> dashboard
- señales de modularidad: dos endpoints con reglas bastante puras y reutilizables fuera del producto original
- señales de acoplamiento o deuda: branding y destinatarios por defecto siguen teñidos por HojaCero
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: sales-agent y cerebro conversacional

- taxonomía: `IA, chat y automatización`
- rutas clave: `utils/sales-agent/BrainModule.ts`, `system-prompt.ts`, `components/sales-agent/*`, `app/api/sales-agent/*`
- problema que resuelve: conversar, diagnosticar y empujar cierre comercial según auditoría técnica
- alcance real observado: motor de objeciones, deseo, cierre y perfilado + UI de chat
- dependencias externas: modelos AI vía APIs, Next.js
- entidades y flujos principales: audit results -> perfil -> respuesta -> agenda/checkout
- señales de modularidad: cerebro separado de la UI y del endpoint
- señales de acoplamiento o deuda: fuertemente teñido por la marca y el discurso comercial H0
- madurez estimada: `alto`
- potencial de reutilización: `medio`
- observación de extracción: `requiere refactor`

## Módulo: territorial intelligence

- taxonomía: `geo, mapas y territorial`
- rutas clave: `lib/territorial/*`, `utils/groq-territorial.ts`, `app/api/territorial/*`
- problema que resuelve: sintetizar viabilidad territorial y comercial usando fuentes geo y modelos AI
- alcance real observado: estimadores financieros, flujo/ticket, datasets, query builder y síntesis con Groq/Gemini
- dependencias externas: Groq, Gemini, Mapbox, fuentes POI
- entidades y flujos principales: ubicación -> datos y estimadores -> prompt -> síntesis estructurada
- señales de modularidad: dominio altamente encapsulado en `lib/territorial`
- señales de acoplamiento o deuda: dependencia fuerte de proveedores y del caso chileno
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: radar y captura de leads técnicos

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `components/radar/*`, `app/api/radar/*`, `app/dashboard/radar`
- problema que resuelve: buscar, reanalizar y administrar leads con señales técnicas/comerciales
- alcance real observado: scanner, preview, manual entry, rescan y estado
- dependencias externas: scrapers, AI, Supabase
- entidades y flujos principales: búsqueda -> lead -> análisis -> modal de trabajo
- señales de modularidad: dominio muy identificable
- señales de acoplamiento o deuda: se mezcla con el flujo comercial completo del repo
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: pipeline y lead workspace

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `components/pipeline/*`, `components/lead-modal/trabajo/*`, `app/api/pipeline/*`
- problema que resuelve: mover oportunidades por etapas y operar contexto de trabajo del lead
- alcance real observado: board, columnas, ticket, modal de actividad, agenda, assets, chat, email, tracking
- dependencias externas: Supabase, email, posiblemente WhatsApp
- entidades y flujos principales: lead -> etapa -> trabajo interno -> seguimiento
- señales de modularidad: superficie funcional muy clara
- señales de acoplamiento o deuda: concentrado en UI rica y múltiples piezas internas
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: inbox y parsing de correos

- taxonomía: `notificaciones y mensajería`
- rutas clave: `lib/inbox/emailParsing.ts`, `app/api/inbox/notify`, `components/inbox/RichTextEditor.tsx`
- problema que resuelve: ingerir o procesar correo y responder desde un contexto interno
- alcance real observado: parser y capa de notificación con editor enriquecido
- dependencias externas: email parsing, Resend o proveedor equivalente
- entidades y flujos principales: correo entrante -> parsing -> respuesta/notify
- señales de modularidad: parser separado y API dedicada
- señales de acoplamiento o deuda: la experiencia completa vive dentro del panel H0
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: vault de credenciales y activos

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `components/vault/*`, `app/api/vault/killswitch`, `app/dashboard/vault`, `lib/store/encryption.ts`
- problema que resuelve: custodiar accesos, credenciales y activos de clientes
- alcance real observado: listados, detalle, utilidades, chat y killswitch
- dependencias externas: almacenamiento, cifrado
- entidades y flujos principales: cliente -> credencial/activo -> acceso/control
- señales de modularidad: carpeta dedicada con tipos y utilidades
- señales de acoplamiento o deuda: mezcla información sensible con UX muy específica
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: CMS editable y content save

- taxonomía: `CMS, landing y contenido`
- rutas clave: `components/cms/*`, `app/api/cms/*`, `app/cms/admin`, `lib/cms/github.ts`
- problema que resuelve: editar contenido y persistirlo desde un panel
- alcance real observado: contexto CMS, componente editable, save/config/content y soporte GitHub
- dependencias externas: GitHub, Next.js
- entidades y flujos principales: contenido editable -> save -> persistencia
- señales de modularidad: el dominio está bastante aislado
- señales de acoplamiento o deuda: parece diseñado para los sitios internos del repo
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: food-engine

- taxonomía: `POS y operación`
- rutas clave: `components/food-engine/*`, `utils/food-engine/*`
- problema que resuelve: capa transversal para carrito, POS, caja, inventario, finanzas y tracking de food businesses
- alcance real observado: provider, cart drawer, checkout modal, admin, inventory, cash manager, finance dashboard, pos terminal
- dependencias externas: Supabase, React
- entidades y flujos principales: sesión POS -> carrito/orden -> caja/inventario/finanzas
- señales de modularidad: naming y carpetas apuntan a motor reutilizable
- señales de acoplamiento o deuda: alta mezcla entre utilidades DB y componentes UI
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: librería premium de motion/UI

- taxonomía: `CMS, landing y contenido`
- rutas clave: `components/premium/*`, `components/fx/*`, `design-lab/*`
- problema que resuelve: proveer primitives visuales, motion y layouts especiales para sitios
- alcance real observado: cards, gradients, reveal effects, magnetic UI, particles, video scroll
- dependencias externas: framer-motion, gsap, three en partes del repo
- entidades y flujos principales: primitive visual -> sección -> landing/prospecto
- señales de modularidad: colección amplia de componentes reutilizables
- señales de acoplamiento o deuda: falta una capa de design system y documentación formal
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: report builder y exportación PDF cloud

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `components/report/ReportBuilderModal.tsx`, `ReportTemplate.tsx`, `app/api/reporte/*`
- problema que resuelve: construir reportes visuales, exportarlos como PDF y guardarlos en storage con vínculo al lead
- alcance real observado: builder con toggles de secciones, exportación a PDF, subida a Supabase y vinculación al registro fuente
- dependencias externas: Supabase Storage, `html-to-image`, `jspdf`, impresión navegador
- entidades y flujos principales: lead -> customización -> render -> PDF -> storage -> URL pública
- señales de modularidad: builder y template claramente agrupados
- señales de acoplamiento o deuda: hoy depende mucho del shape de `lead` y del bucket `client-assets`
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: B2B store engine y carrito cotizable

- taxonomía: `POS y operación`
- rutas clave: `hooks/b2b-engine/useB2BEngine.tsx`, `components/b2b-store/B2BEngineComponents.tsx`
- problema que resuelve: catálogo técnico B2B con variantes, carrito, cálculo dinámico y salida a WhatsApp
- alcance real observado: provider/context, persistencia local, pricing por variantes, side cart y modal de producto
- dependencias externas: React context, localStorage, WhatsApp
- entidades y flujos principales: producto -> variantes -> carrito -> total -> mensaje WhatsApp
- señales de modularidad: engine separado de la UI y con tipos propios
- señales de acoplamiento o deuda: la salida comercial está muy orientada a WhatsApp y a un caso CAM Solutions
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: growth engine y cartera de crecimiento

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `components/growth/*`, `app/api/growth/check-alerts`, `utils/growth-automation`, `components/growth/plans.ts`
- problema que resuelve: gestionar cartera growth, tareas por cliente, planes recurrentes, salud del cliente y alertas
- alcance real observado: roster, vista cliente, planes Foundation/Velocity/Dominance, activity log y alerta automática por correo
- dependencias externas: Supabase, Resend, cron secret
- entidades y flujos principales: cliente growth -> tareas/planes -> health score -> alertas y actividad
- señales de modularidad: dominio muy claro y separado del resto del dashboard
- señales de acoplamiento o deuda: mezcla UI completa con automatización y naming comercial propio
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: fleet editor y CMS multi-sitio

- taxonomía: `CMS, landing y contenido`
- rutas clave: `app/api/fleet/*`, `components/factory/*`, `components/cms/*`
- problema que resuelve: listar sitios editables y operar persistencia de contenido para múltiples sitios monitoreados
- alcance real observado: listado de sitios `cms_active`, save/content APIs y relación con CMS GitHub
- dependencias externas: Supabase, GitHub
- entidades y flujos principales: sitio monitoreado -> contenido -> save -> persistencia
- señales de modularidad: el dominio `fleet` está claramente separado en API
- señales de acoplamiento o deuda: comparte mucho con el CMS base y requiere separar mejor sitio vs repositorio
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: demo tracking y device fingerprint analytics

- taxonomía: `notificaciones y mensajería`
- rutas clave: `components/tracking/DemoTracker.tsx`, `app/api/tracking/*`
- problema que resuelve: trackear visitas a demos/prospectos y distinguir equipo interno de tráfico externo
- alcance real observado: tracker invisible, fingerprint simple, registro de dispositivos internos y endpoints demo/stats/team-device
- dependencias externas: navegador, Next.js API, persistencia backend
- entidades y flujos principales: visita prospecto -> fingerprint -> evento tracking -> stats
- señales de modularidad: tracker y endpoints propios del dominio
- señales de acoplamiento o deuda: depende del routing `/prospectos/*` y de una semántica muy Hojacero
- madurez estimada: `medio`
- potencial de reutilización: `medio`
- observación de extracción: `requiere refactor`

## Módulo: bóveda operativa y cobranzas

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `app/api/boveda/*`, `app/api/vault/*`, `components/vault/*`
- problema que resuelve: administrar clientes, proyectos, cobros, accesos sensibles y controles de killswitch
- alcance real observado: clientes/proyectos/cobros por API + vault de activos y verificación/killswitch
- dependencias externas: Supabase, cifrado, auth
- entidades y flujos principales: cliente -> proyecto -> cobro/credencial -> control operativo
- señales de modularidad: subdominio administrativo bastante reconocible
- señales de acoplamiento o deuda: autorización hardcodeada en partes de API y mezcla vault con cobranza
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: housing intel map surface

- taxonomía: `geo, mapas y territorial`
- rutas clave: `components/housing-intel/HousingMap.tsx`
- problema que resuelve: visualizar propiedades o puntos geo en una superficie premium de mapa
- alcance real observado: mapa Mapbox dark, flyTo dinámico y markers con popup
- dependencias externas: Mapbox
- entidades y flujos principales: centro geo -> markers -> popup informativo
- señales de modularidad: componente visual aislado y de bajo acoplamiento
- señales de acoplamiento o deuda: hoy es más superficie visual que motor territorial
- madurez estimada: `medio`
- potencial de reutilización: `medio`
- observación de extracción: `extraíble`

## Módulo: scraping intelligence kit

- taxonomía: `geo, mapas y territorial`
- rutas clave: `lib/scrapers/index.ts`, `ubereats-scraper.ts`, `serper-scraper.ts`, `portal-inmobiliario-scraper.ts`, `portal-inmobiliario-cached.ts`, `tomtom-scraper.ts`, `foursquare-scraper.ts`
- problema que resuelve: recolectar inteligencia territorial, competitiva y comercial desde fuentes externas para food, mapas e inmobiliario
- alcance real observado: búsqueda por APIs públicas/semipúblicas, fallback entre fuentes, deduplicación, clasificación por rubro, análisis de saturación y caché Supabase
- dependencias externas: fetch externo, Serper, UberEats/PedidosYa, Puppeteer, Supabase, TomTom/Foursquare según conector
- entidades y flujos principales: ubicación/comuna -> consulta externa -> normalización -> análisis/caché -> dataset explotable
- señales de modularidad: carpeta propia, `index.ts` agregador, engine genérico aparte y funciones separadas por fuente/proveedor
- señales de acoplamiento o deuda: mezcla scraping real con datos demo/fallback y depende fuerte de APIs volátiles o protegidas
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: landing factory y editor de campañas

- taxonomía: `CMS, landing y contenido`
- rutas clave: `components/factory/*`, `hooks/factory/useAdsFactory.ts`, `types/factory.ts`
- problema que resuelve: construir y editar landings modulares con secciones configurables, preview y theming comercial
- alcance real observado: editor visual de estructura, renderer por secciones, esquema tipado de landing, preview embebido, bloques hero/proof/cta y un linaje de workflows/skills factory mucho más grande alrededor de la producción de sitios
- dependencias externas: React, Next.js, framer-motion, dashboard theme
- entidades y flujos principales: config landing -> edición de secciones -> preview -> guardado/publicación
- señales de modularidad: tipos propios, hook dedicado, renderer central basado en `section.type` y separación clara entre config, editor y renderer
- señales de acoplamiento o deuda: hoy está incompleto en bloques y aún mezcla editor, preview y persistencia simulada
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: academy progression y certificación interna

- taxonomía: `IA, chat y automatización`
- rutas clave: `app/dashboard/academy/*`, `lib/academy-content.ts`
- problema que resuelve: entrenar operadores internos con módulos, gating secuencial, quiz y certificación básica
- alcance real observado: contenido tipado por módulo/lección, quiz con passing score, desbloqueo por progreso y persistencia por usuario
- dependencias externas: Supabase auth/progress, Next.js dashboard
- entidades y flujos principales: módulo -> lecciones -> quiz -> progreso -> desbloqueo siguiente -> certificación
- señales de modularidad: el modelo de contenido y la lógica de progresión están bastante aislados de la UI visual
- señales de acoplamiento o deuda: hoy el contenido está totalmente escrito para la operación Growth de HojaCero
- madurez estimada: `medio`
- potencial de reutilización: `medio`
- observación de extracción: `requiere refactor`

## Módulo: payment gateway router de tienda

- taxonomía: `pagos y checkout`
- rutas clave: `app/api/store/create-payment/route.ts`, `app/api/store/webhook/route.ts`, `lib/store/payment-gateways`
- problema que resuelve: crear cobros y normalizar webhooks para distintos gateways desde una misma tienda interna
- alcance real observado: creación de orden local, elección de gateway configurado, checkout URL y parser de webhooks para Mercado Pago, Flow y Transbank
- dependencias externas: Supabase y gateways de pago
- entidades y flujos principales: carrito -> orden -> gateway elegido -> webhook -> confirmación pago
- señales de modularidad: la idea de router y normalización multi-provider es fuerte y ya quedó absorbida parcialmente en `MODULOS`
- señales de acoplamiento o deuda: persiste acoplado al schema de la tienda H0 y al backend local de órdenes
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: territorial report outline

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `lib/pdf-generator.ts`
- problema que resuelve: estructurar un reporte territorial en secciones reutilizables antes del render PDF
- alcance real observado: portada, ecosistema, demografía, flujos, competencia, veredicto y recomendación digital
- dependencias externas: ninguna en el outline; el origen usa `jspdf` para render
- entidades y flujos principales: `report` -> bloques de análisis -> secciones del reporte
- señales de modularidad: la narrativa del reporte está claramente separable del renderer final
- señales de acoplamiento o deuda: copy y estructura siguen muy marcados por el lenguaje HojaCero
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`
