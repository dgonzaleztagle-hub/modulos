# fidelizacion

Repo origen: `D:\proyectos\fidelizacion`

## Módulo: booking por rubro

- taxonomía: `reservas y agenda`
- rutas clave: `src/lib/booking-config.ts`, `src/app/[slug]/agendar/AgendarClient.tsx`
- problema que resuelve: adaptar servicios y labels del flujo de agenda según el tipo de negocio
- alcance real observado: presets para barbería, peluquería, spa, podología, estética, nail y masajes
- dependencias externas: ninguna en la lógica base
- entidades y flujos principales: rubro -> catálogo de servicios -> flujo de agendamiento
- señales de modularidad: configuración pura, fácil de portar
- señales de acoplamiento o deuda: catálogo de rubros hardcodeado y orientado a verticales de servicios personales
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: agenda cliente con push notifications

- taxonomía: `reservas y agenda`
- rutas clave: `src/app/cliente/tabs/AgendaTab.tsx`, `/api/appointments*`, `/api/push/subscribe`
- problema que resuelve: dar a clientes o dueños una superficie móvil para ver y actualizar citas con alertas push
- alcance real observado: vista de agenda, cambio de estado, selector por días y activación/desactivación de push
- dependencias externas: browser Push API, service worker
- entidades y flujos principales: cita -> agenda diaria -> cambio de estado -> notificación
- señales de modularidad: componente grande pero con dominio muy claro
- señales de acoplamiento o deuda: depende del modelo `TenantData` y del backend propio del producto
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: webpush delivery por tenant y cliente

- taxonomía: `notificaciones y mensajería`
- rutas clave: `src/lib/webpush.ts`
- problema que resuelve: enviar push web a audiencias por tenant o cliente y limpiar subscripciones vencidas
- alcance real observado: payload server-side, targeting por tenant/cliente, limpieza 404/410 y separación de errores reintentables
- dependencias externas: `web-push`, base de datos del integrador
- entidades y flujos principales: audience -> subscripciones -> intento push -> cleanup de expiradas
- señales de modularidad: la lógica de targeting, payload y clasificación es portable y clara
- señales de acoplamiento o deuda: transporte VAPID y persistencia siguen en el integrador
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: tenancy para negocios de fidelización

- taxonomía: `auth y tenants`
- rutas clave: `src/app/admin/negocios/[id]/TenantDetailPage.tsx`, `migrations/006_tenant_brand_color_guard.sql`
- problema que resuelve: administrar tenants con branding y reglas de negocio para una plataforma de fidelización/agendamiento
- alcance real observado: detalle de tenant, branding y guardrails de color/marca
- dependencias externas: base de datos, framework app router
- entidades y flujos principales: tenant -> branding/config -> operación del producto
- señales de modularidad: hay una intención clara de plataforma multitenant
- señales de acoplamiento o deuda: aún se ve bastante inmerso en la app final
- madurez estimada: `medio`
- potencial de reutilización: `medio`
- observación de extracción: `solo referencia`

## Módulo: google wallet pass y geofencing

- taxonomía: `integraciones externas`
- rutas clave: `src/lib/googleWallet.ts`, `src/lib/wallet/push.ts`
- problema que resuelve: construir pases Wallet, candidates de objectId y mensajes geolocalizados para fidelización
- alcance real observado: labels por tipo de programa, create class idempotente, save links, payload de clase/objeto y geofencing
- dependencias externas: Google Wallet API, JWT en el integrador real
- entidades y flujos principales: tenant + cliente + programa -> loyalty class/object -> save link y notificación
- señales de modularidad: la forma del pass y del objectId es altamente portable
- señales de acoplamiento o deuda: el transporte a Google y las credenciales siguen específicas del producto
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: program motor config

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/lib/motorConfig.ts`, `src/lib/programTypes.ts`
- problema que resuelve: leer y migrar configuraciones de programas de fidelización por tipo
- alcance real observado: compatibilidad entre formato `motors` moderno y claves legacy
- dependencias externas: ninguna
- entidades y flujos principales: config raw -> type -> motor config normalizada
- señales de modularidad: pura, pequeña y muy clara
- señales de acoplamiento o deuda: el naming de tipos sigue anclado al producto de fidelización
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: gamification tiers y streaks

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/lib/gamification.ts`
- problema que resuelve: rankear clientes por puntos históricos y continuidad semanal
- alcance real observado: tiers, badge visual y racha por semanas
- dependencias externas: ninguna
- entidades y flujos principales: visitas/puntos -> racha/tier -> experiencia loyalty
- señales de modularidad: completamente pura y fácil de absorber al ledger actual
- señales de acoplamiento o deuda: thresholds diseñados para el caso Vuelve+
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: flow subscriptions y customer billing

- taxonomía: `pagos y checkout`
- rutas clave: `src/lib/flow.ts`
- problema que resuelve: firmar y preparar operaciones Flow para clientes, tarjetas, planes y suscripciones
- alcance real observado: firma HMAC, creación/listado de customer, plan, suscripción y registro de tarjeta
- dependencias externas: Flow como gateway, aunque la firma y el payload son portables
- entidades y flujos principales: customer -> plan -> suscripción -> tarjeta -> request firmado
- señales de modularidad: la parte de firma y armado de parámetros es muy clara y reutilizable
- señales de acoplamiento o deuda: transporte HTTP y credenciales siguen específicas del integrador
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: billing plan catalog

- taxonomía: `auth y tenants`
- rutas clave: `src/lib/plans.ts`
- problema que resuelve: definir catálogo comercial, límites y programas disponibles por plan
- alcance real observado: planes `pyme`, `pro`, `full`, límites y mapeo a plan de cobro
- dependencias externas: ninguna
- entidades y flujos principales: tenant -> plan efectivo -> límites -> programas habilitados
- señales de modularidad: puro y muy central para gating comercial
- señales de acoplamiento o deuda: pricing y naming siguen atados a la estrategia actual de Fidelización
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: advisor insights

- taxonomía: `IA, chat y automatización`
- rutas clave: `src/lib/advisor.ts`
- problema que resuelve: convertir métricas de retención y referidos en recomendaciones accionables para el negocio
- alcance real observado: alertas de retención, VIP, referidos, canje y fallback onboarding de datos
- dependencias externas: ninguna
- entidades y flujos principales: métricas + top clientes -> insight -> acción sugerida
- señales de modularidad: heurísticas puras, fáciles de mover a dashboards o agentes
- señales de acoplamiento o deuda: los textos siguen en tono Vuelve+ y se pueden generalizar más
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Veredicto

- `fidelizacion` sí sostiene una familia propia y no solo una variante de booking
- lo más fuerte no es la agenda, sino el ensamblaje `programa loyalty + wallet + push + billing + heurísticas`
- no aparece otra mina grande escondida fuera de esa familia; lo demás ya cae en superficies o variaciones del mismo stack
