# CorredoresPro

Repo origen: `D:\proyectos\CorredoresPro`

## Módulo: multi-tenant inmobiliario

- taxonomía: `auth y tenants`
- rutas clave: `database/02_multi_tenant_setup.sql`, `03_auto_tenant_creation.sql`, `src/lib/supabase-tenant-setup.ts`, `src/hooks/useAuth.ts`
- problema que resuelve: separar datos y operación por corredora/tenant
- alcance real observado: base multi-tenant a nivel schema y helpers de setup
- dependencias externas: Supabase
- entidades y flujos principales: tenant -> setup -> datos segregados
- señales de modularidad: tanto SQL como helpers apuntan a una intención clara de plataforma
- señales de acoplamiento o deuda: arrastra migración desde Nhost y ajustes evolutivos
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: publisher externo de propiedades

- taxonomía: `integraciones externas`
- rutas clave: `src/lib/publisher.ts`, `supabase/functions/ml-exchange-token`, `ml-publisher`, `src/pages/settings/MLCallback.tsx`
- problema que resuelve: conectar credenciales de plataforma y publicar/actualizar propiedades externamente
- alcance real observado: token exchange, publish, update, unpublish y lectura de publicaciones
- dependencias externas: plataforma externa de publicación, Supabase functions
- entidades y flujos principales: credencial -> property -> publicación externa -> sync
- señales de modularidad: cliente frontend y edge functions bien separados
- señales de acoplamiento o deuda: naming `ML` y `portal_inmobiliario` requiere clarificación futura
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: contratos y PDF legal

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `src/components/ContractPDF.tsx`, `database/06_fase2_firma_electronica.sql`, `supabase/functions/sign-contract`
- problema que resuelve: generar contrato de arriendo y soportar flujo de firma
- alcance real observado: documento PDF bastante completo y backend de firma
- dependencias externas: `@react-pdf/renderer`, servicio de firma electrónica
- entidades y flujos principales: contrato + propiedad + cliente -> PDF -> firma
- señales de modularidad: documento aislado y backend de firma desacoplado
- señales de acoplamiento o deuda: texto legal y estructura de contrato están pegados al rubro inmobiliario
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: portales propietario/arrendatario/público

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/pages/portal/OwnerPortal.tsx`, `TenantPortal.tsx`, `supabase/functions/owner-portal-data`, `tenant-portal-data`, `public-portal`
- problema que resuelve: exponer vistas distintas según actor externo del negocio
- alcance real observado: portal propietario con KPIs financieros, portal arrendatario con pagos/deuda/firma y portal público de corredores/propiedades
- dependencias externas: Supabase functions
- entidades y flujos principales: actor -> token/enlace público -> payload especializado -> lectura de cartera/contrato/contacto
- señales de modularidad: separación fuerte por superficie de acceso
- señales de acoplamiento o deuda: modelo orientado a propiedad/contrato/cliente
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: mensajería y contacto

- taxonomía: `notificaciones y mensajería`
- rutas clave: `src/lib/whatsapp.ts`, `src/pages/messages/MessagesCenter.tsx`, `supabase/functions/send-contact-email`
- problema que resuelve: centralizar contacto y salidas de mensajería
- alcance real observado: centro de mensajes, WhatsApp helper y envío de contacto
- dependencias externas: WhatsApp, email
- entidades y flujos principales: contacto -> mensaje -> dispatch
- señales de modularidad: helpers y funciones separados
- señales de acoplamiento o deuda: caso de uso inmerso en el CRM inmobiliario
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: onboarding de corredora

- taxonomía: `auth y tenants`
- rutas clave: `src/pages/onboarding/Onboarding.tsx`, `src/lib/supabase-tenant-setup.ts`
- problema que resuelve: provisionar corredora, dueño inicial y contexto mínimo del tenant
- alcance real observado: onboarding dedicado conectado al setup multi-tenant
- dependencias externas: Supabase
- entidades y flujos principales: registro -> setup tenant -> acceso al producto
- señales de modularidad: flujo y helper de setup bien separados
- señales de acoplamiento o deuda: acoplado al vocabulario inmobiliario y a la estructura del producto final
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: tablero financiero y cobranza

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/pages/finance/FinanceDashboard.tsx`, `src/pages/reports/ReportsOverview.tsx`, `src/lib/supabase-helpers.ts`
- problema que resuelve: consolidar ingresos, proyección, mora, ocupación y movimientos financieros por tenant
- alcance real observado: registro de pagos, KPIs mensuales, proyección por contratos activos, cartera por cobrar y reportes de ocupación/ingresos
- dependencias externas: Supabase, UF chilena
- entidades y flujos principales: contratos + pagos + propiedades -> resumen financiero -> cobranza/decisión operacional
- señales de modularidad: la lectura financiera se apoya en helpers y cálculos bastante separables del UI
- señales de acoplamiento o deuda: varias consultas viven aún en frontend y la semántica está muy cargada al negocio inmobiliario
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: portal público de corredoras y propiedades

- taxonomía: `CMS, landing y contenido`
- rutas clave: `src/pages/public/PublicPortal.tsx`, `src/pages/public/BrokerProfile.tsx`, `supabase/functions/public-portal`
- problema que resuelve: exponer corredor, propiedades destacadas y búsqueda pública por comuna sin entrar al backoffice
- alcance real observado: directorio público de corredoras con preview de propiedades, contacto y filtros geográficos
- dependencias externas: Supabase functions, WhatsApp/mail links
- entidades y flujos principales: comuna/filtro -> corredor -> preview propiedades -> perfil/contacto
- señales de modularidad: superficie pública separada del portal privado y del dashboard interno
- señales de acoplamiento o deuda: copy, labels y entidades viven completamente en vertical inmobiliaria
- madurez estimada: `medio`
- potencial de reutilización: `medio`
- observación de extracción: `solo referencia`

## Observación de madurez

- el repo no está terminado, pero sus familias principales sí muestran borde reusable claro: tenancy, publisher, portales por rol, cobranza/arrears y contratos documentales

## Módulo: outline de contrato de arriendo

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `src/components/ContractPDF.tsx`
- problema que resuelve: estructurar un contrato de arriendo en secciones, cláusulas y firmas antes del render PDF
- alcance real observado: partes, inmueble, condiciones económicas, plazo y cláusulas legales base
- dependencias externas: `@react-pdf/renderer` solo en la capa final de render
- entidades y flujos principales: contrato + propiedad + cliente -> outline -> PDF final
- señales de modularidad: formato y contenido legal se distinguen del renderer
- señales de acoplamiento o deuda: copy legal chileno y vertical inmobiliaria incrustados en el documento
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: política de mora y alertas legales

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/lib/supabase-helpers.ts`, `src/components/MorosidadAlerts.tsx`
- problema que resuelve: agrupar contratos con pagos vencidos y clasificar severidad operacional/legal
- alcance real observado: cálculo de días de mora, buckets `warning/alert/critical` y mensaje por Ley 21.461
- dependencias externas: ninguna a nivel de regla; el origen usa Supabase para traer datos
- entidades y flujos principales: pagos -> contrato -> días de mora -> severidad -> aviso
- señales de modularidad: la política se pudo separar limpiamente del fetch y de la UI
- señales de acoplamiento o deuda: umbrales y copy siguen orientados al caso inmobiliario chileno
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`
