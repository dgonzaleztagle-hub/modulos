# rishtedar

Repo origen: `D:\proyectos\rishtedar`

## Módulo: reservas operativas y panel diario

- taxonomía: `reservas y agenda`
- rutas clave: `lib/services/reservationService.ts`, `app/api/reservations/*`, `components/dashboard/ReservationsView.tsx`
- problema que resuelve: consultar, listar y actualizar reservas para operación diaria
- alcance real observado: hoy, próximas reservas y cambio de estado desde dashboard
- dependencias externas: fetch a APIs internas, Next.js
- entidades y flujos principales: reserva -> consulta diaria/semanal -> actualización de estado
- señales de modularidad: servicio separado del componente y API dedicada
- señales de acoplamiento o deuda: fuerte dependencia a endpoints internos y al shape del dashboard
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: delivery y tracking PWA

- taxonomía: `delivery y tracking`
- rutas clave: `app/api/delivery/*`, `app/api/orders/*`, `components/pwa/OrderTracker.tsx`, `app/app/track/[orderId]`
- problema que resuelve: crear, asignar y seguir pedidos en una superficie móvil/PWA
- alcance real observado: create order, tracking, token driver y feed operativo
- dependencias externas: Next.js, Zustand, PWA/browser APIs
- entidades y flujos principales: pedido -> asignación -> tracking cliente/driver
- señales de modularidad: rutas y componentes dedicados por dominio
- señales de acoplamiento o deuda: mezcla ordering, backoffice y UX PWA dentro del mismo repo
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: loyalty, game y promociones

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `lib/loyalty/config.ts`, `lib/services/loyaltyService.ts`, `lib/services/gameService.ts`, `app/api/promotions/*`, `app/api/game/score`
- problema que resuelve: activar fidelización, puntaje y campañas promocionales
- alcance real observado: configuración loyalty, scoring de game y banners/promotions activos
- dependencias externas: Next.js, Supabase
- entidades y flujos principales: usuario -> puntos/config -> promoción o gameplay
- señales de modularidad: carpeta `loyalty` y servicios separados
- señales de acoplamiento o deuda: parte del valor está en UI, marca y experiencia específica
- madurez estimada: `medio`
- potencial de reutilización: `medio`
- observación de extracción: `requiere refactor`

## Módulo: weekly ranking y leaderboard de juego

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `lib/services/gameService.ts`, `app/api/game/score/route.ts`
- problema que resuelve: limitar intentos ranked por semana y publicar un leaderboard limpio por jugador
- alcance real observado: cálculo de semana, máximo 3 intentos válidos, deduplicación por mejor score y salida con hint privado del teléfono
- dependencias externas: la API original usa Supabase admin, pero la lógica base es portable
- entidades y flujos principales: score -> validación semanal -> inserción ranked -> leaderboard top 10
- señales de modularidad: helpers puros claros y regla de negocio con borde técnico limpio
- señales de acoplamiento o deuda: hoy está narrado como minijuego del restaurante y no como motor de engagement genérico
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: scanner QR para staff

- taxonomía: `POS y operación`
- rutas clave: `components/scanner/QRScannerCore.tsx`, `StaffScannerPanel.tsx`, `app/scanner/[branch]/page.tsx`
- problema que resuelve: validar o escanear interacciones operativas desde staff
- alcance real observado: scanner por sucursal integrado al dashboard
- dependencias externas: `html5-qrcode`
- entidades y flujos principales: staff -> scanner -> validación por branch
- señales de modularidad: componentes dedicados y aislados
- señales de acoplamiento o deuda: acoplado a routing, permisos y semántica de branch
- madurez estimada: `medio`
- potencial de reutilización: `medio`
- observación de extracción: `requiere refactor`

## Módulo: dashboard operativo restaurante

- taxonomía: `POS y operación`
- rutas clave: `components/dashboard/*`, `app/dashboard/*`
- problema que resuelve: unificar delivery, reservas, promociones, loyalty, analytics y menú en una sola consola
- alcance real observado: consola transversal para operación
- dependencias externas: Next.js, Supabase, librerías UI
- entidades y flujos principales: órdenes, reservas, promociones, usuarios y menú
- señales de modularidad: secciones claras por vista
- señales de acoplamiento o deuda: muy acoplado a la app específica y a múltiples tablas
- madurez estimada: `medio`
- potencial de reutilización: `medio`
- observación de extracción: `solo referencia`

## Módulo: webhook y checkout de pagos

- taxonomía: `pagos y checkout`
- rutas clave: `app/api/webhooks/mercadopago`, `app/order/checkout`, `app/order/confirmation`, `lib/payments`
- problema que resuelve: cerrar compra y reconciliar eventos de pago
- alcance real observado: checkout y webhook de Mercado Pago vinculados al flujo de pedido
- dependencias externas: Mercado Pago
- entidades y flujos principales: carrito -> checkout -> webhook -> confirmación
- señales de modularidad: separación entre páginas y API webhook
- señales de acoplamiento o deuda: no se observó en esta pasada una librería de pagos bien consolidada
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: loyalty ledger por cliente

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `lib/services/loyaltyService.ts`, `lib/loyalty/config.ts`, `app/api/staff/customer/route.ts`
- problema que resuelve: centralizar la lógica de puntos, tiers y transacciones por cliente
- alcance real observado: cálculo de puntos, award on order/manual/redemption, ledger transaccional y lookup de cliente
- dependencias externas: Supabase admin
- entidades y flujos principales: orden o acción staff -> puntos -> tier -> historial de cliente
- señales de modularidad: servicio explícito y comentado como fuente única de verdad
- señales de acoplamiento o deuda: depende de tablas loyalty del producto y del shape de negocio por branch
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: promotions CMS y banner engine

- taxonomía: `CMS, landing y contenido`
- rutas clave: `components/dashboard/PromotionsCMS.tsx`, `BannersCMS.tsx`, `components/home/PromoBanner.tsx`, `hooks/useActivePromotion.ts`
- problema que resuelve: crear promociones programadas y convertirlas en banners visuales activos
- alcance real observado: scheduler por fecha/día/hora, assets visuales, estilos tipográficos y publicación como banner
- dependencias externas: Next.js, storage/upload, UI
- entidades y flujos principales: promoción -> reglas de vigencia -> banner activo -> superficie pública/dashboard
- señales de modularidad: dominio claro entre promociones y render público
- señales de acoplamiento o deuda: fuerte mezcla de branding del restaurante y editor visual del caso
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: dashboard alerts + tone config

- taxonomía: `notificaciones y mensajería`
- rutas clave: `hooks/useRealtimeAlerts.ts`
- problema que resuelve: emitir alertas operativas de pedido, reserva y delivery con configuración sonora diferenciada
- alcance real observado: copy por evento, tonos por tipo y soporte para estados de dashboard
- dependencias externas: Web Audio y Supabase en el hook original; el core de mensajes/tonos es portable
- entidades y flujos principales: `DashboardAlert` -> evento de orden/reserva/delivery -> copy + tono
- señales de modularidad: la configuración tonal y el copy se separan con facilidad del hook realtime
- señales de acoplamiento o deuda: el hook mezcla realtime, localStorage y audio browser en una sola pieza
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: hospitality emails de reserva y newsletter

- taxonomía: `notificaciones y mensajería`
- rutas clave: `lib/services/notificationService.ts`
- problema que resuelve: construir correos transaccionales de confirmación de reserva y bienvenida al newsletter sin acoplarlos al provider
- alcance real observado: plantillas HTML/texto para reserva confirmada y welcome flow de marca
- dependencias externas: Resend en origen; el core de templates es portable
- entidades y flujos principales: reserva -> email confirmación, suscripción -> email bienvenida
- señales de modularidad: los payloads de email están claramente separados del transporte
- señales de acoplamiento o deuda: branding y copy del restaurante vienen mezclados en la plantilla original
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`
