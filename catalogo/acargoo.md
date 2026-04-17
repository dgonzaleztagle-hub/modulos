# acargoo

Repo origen: `D:\proyectos\acargoo`

## Módulo: pricing delivery de carga

- taxonomía: `delivery y tracking`
- rutas clave: `lib/acargoo/domain/pricing.ts`, `lib/acargoo/domain/types.ts`, `app/api/acargoo/pricing`
- problema que resuelve: calcular tarifas para servicios de carga con soporte para precio fijo, cotización manual y base más kilómetro
- alcance real observado: motor de precio orientado a CLP con `pricingMode`, `basePrice`, `pricePerKm` y `multiplier`
- dependencias externas: ninguna directa en el cálculo
- entidades y flujos principales: `AcargooService` -> `PricingInput` -> `calculatePrice`
- señales de modularidad: lógica pura, sin UI, sin fetch, sin acoplamiento a Next
- señales de acoplamiento o deuda: acoplado a tipos del dominio Acargoo y a reglas chilenas implícitas
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: state machine de órdenes

- taxonomía: `delivery y tracking`
- rutas clave: `lib/acargoo/domain/state-machine.ts`, `lib/acargoo/domain/types.ts`
- problema que resuelve: validar transiciones permitidas entre estados de orden
- alcance real observado: mapa explícito de transiciones desde `pending` hasta `completed`, con manejo de cancelación y falla
- dependencias externas: ninguna
- entidades y flujos principales: `OrderStatus` -> `isValidOrderTransition` -> `assertOrderTransition`
- señales de modularidad: implementación pura, fácil de portar a backend o frontend
- señales de acoplamiento o deuda: la máquina está fija a este flujo y no parametrizada por tipo de servicio
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: pricing de peajes y cumplimiento de ruta

- taxonomía: `delivery y tracking`
- rutas clave: `lib/acargoo/domain/toll-pricing.ts`, `lib/acargoo/domain/route-compliance.ts`, `lib/acargoo/data/toll-store.ts`
- problema que resuelve: sumar costos de peajes y verificar consistencia de ruta
- alcance real observado: motor complementario al precio base, orientado a rutas de carga
- dependencias externas: store de peajes, posible uso de mapas
- entidades y flujos principales: ruta -> peajes estimados -> costo total / validación
- señales de modularidad: carpeta de dominio separada y store dedicado
- señales de acoplamiento o deuda: depende del set de datos y de supuestos locales sobre rutas
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: tracking y mapa de servicio

- taxonomía: `delivery y tracking`
- rutas clave: `components/aplicaciones/acargoo/AcargooTracker.tsx`, `AcargooMap.tsx`, `AddressMapPicker.tsx`, `lib/acargoo/domain/maps-public.ts`, `geo.ts`
- problema que resuelve: selección de direcciones, visualización de ruta y seguimiento del pedido
- alcance real observado: UX de mapa + capa de dominio geográfica
- dependencias externas: `leaflet`, `react-leaflet`
- entidades y flujos principales: dirección origen/destino -> mapa -> seguimiento de orden
- señales de modularidad: separación parcial UI/dominio
- señales de acoplamiento o deuda: la experiencia está atada a componentes de producto y a la app Acargoo
- madurez estimada: `medio`
- potencial de reutilización: `medio`
- observación de extracción: `requiere refactor`

## Módulo: POD PDF y comunicación post-entrega

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `lib/acargoo/domain/pod-pdf.ts`, `domain/email-template.ts`, `domain/notifications.ts`, `adapters/email`, `adapters/push`
- problema que resuelve: generar comprobante de entrega y notificar actores del flujo
- alcance real observado: soporte para PDF de entrega, correos y push a drivers
- dependencias externas: `pdf-lib`, `web-push`
- entidades y flujos principales: orden completada -> PDF POD -> email/push
- señales de modularidad: adapters separados, dominio centralizado
- señales de acoplamiento o deuda: contratos de orden y plantillas de correo parecen específicos del negocio
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: suscripciones push de chofer

- taxonomía: `notificaciones y mensajería`
- rutas clave: `lib/acargoo/domain/driver-push.ts`, `adapters/push/web-push.ts`, `app/api/acargoo/driver/push`
- problema que resuelve: guardar, sanear y mantener endpoints push por chofer para notificaciones operativas
- alcance real observado: normalización de `PushSubscription`, upsert por endpoint y limpieza por chofer
- dependencias externas: `web-push` solo en el adapter; el core es puro
- entidades y flujos principales: chofer -> suscripción web push -> persistencia por endpoint
- señales de modularidad: funciones puras y contrato muy claro
- señales de acoplamiento o deuda: estructura `byDriver` hardcodeada al shape actual de configuración
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: mensajería y correo transaccional de servicio

- taxonomía: `notificaciones y mensajería`
- rutas clave: `lib/acargoo/domain/notifications.ts`, `lib/acargoo/domain/email-template.ts`
- problema que resuelve: producir mensajes cortos y correos HTML/texto para actualizaciones de un servicio logístico
- alcance real observado: copy por evento, enlaces `wa.me`, subject, body HTML y versión texto con tracking y soporte
- dependencias externas: ninguna en el core; solo `Intl` y strings HTML
- entidades y flujos principales: orden + tipo de evento -> mensaje -> correo/canal de salida
- señales de modularidad: dominio puro y claramente separado de adapters reales de envío
- señales de acoplamiento o deuda: copy y URLs todavía vienen teñidos por la marca Acargoo
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: onboarding y aplicaciones multi-rol

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `app/api/acargoo/onboarding`, `app/aplicaciones/acargoo/admin`, `b2b`, `driver`, `services`, `settings`
- problema que resuelve: operar distintas superficies del producto según actor
- alcance real observado: admin, cliente B2B y driver con APIs dedicadas
- dependencias externas: Next.js, Supabase
- entidades y flujos principales: usuario -> rol -> superficie / API correspondiente
- señales de modularidad: dominios de actor ya segmentados
- señales de acoplamiento o deuda: muy mezclado con la arquitectura del producto completo
- madurez estimada: `medio`
- potencial de reutilización: `medio`
- observación de extracción: `solo referencia`

## Módulo: driver onboarding con provisión de acceso

- taxonomía: `auth y tenants`
- rutas clave: `app/api/acargoo/drivers/onboard/route.ts`, `lib/acargoo/data/store.ts`
- problema que resuelve: crear conductores operativos con validación fuerte de vehículo y, opcionalmente, provisionar su acceso de login sin dejar registros colgando
- alcance real observado: validación de email/teléfono/categoría/patente/año, creación de usuario auth, rollback si falla el perfil y vinculación con `driver_id`
- dependencias externas: Supabase Auth/Admin y store del producto
- entidades y flujos principales: formulario chofer -> validación -> auth user -> driver row -> profile linkage
- señales de modularidad: flujo muy claro de onboarding operativo con compensación/rollback
- señales de acoplamiento o deuda: hoy está acoplado a Supabase Auth y al modelo de chofer de Acargoo
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: dispatch ranking engine

- taxonomía: `delivery y tracking`
- rutas clave: `lib/acargoo/domain/dispatch.ts`, `lib/acargoo/domain/types.ts`, `geo.ts`
- problema que resuelve: rankear conductores candidatos para asignación según cercanía, disponibilidad, rating y capacidad
- alcance real observado: scoring con pesos explícitos para disponibilidad, distancia y calidad
- dependencias externas: ninguna directa; usa utilidades geográficas del dominio
- entidades y flujos principales: orden -> pickup -> conductores/vehículos -> ranking de candidatos
- señales de modularidad: función pura y borde de responsabilidad muy claro
- señales de acoplamiento o deuda: pesos y umbrales están hardcodeados para la operación actual
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: booking público de servicio

- taxonomía: `reservas y agenda`
- rutas clave: `app/api/acargoo/_shared/public-booking.ts`, `components/aplicaciones/acargoo/BookingCalendar.tsx`, `BookingForm.tsx`, `BookingConfirmation.tsx`
- problema que resuelve: permitir intake público de solicitudes y calendarización de servicios logísticos
- alcance real observado: formulario, calendario y confirmación desacoplados del panel interno
- dependencias externas: Next.js, componentes React
- entidades y flujos principales: visitante -> booking público -> confirmación -> seguimiento
- señales de modularidad: superficies de booking bastante delimitadas
- señales de acoplamiento o deuda: comparte contratos con el producto Acargoo y no se revisó todo el backend asociado
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: intake público/B2B de órdenes con guardas reales

- taxonomía: `delivery y tracking`
- rutas clave: `app/api/acargoo/orders/route.ts`, `_shared/public-booking.ts`
- problema que resuelve: aceptar órdenes públicas o corporativas con validaciones de identidad, geocodificación automática, rate limit y reglas específicas por cuenta/PO
- alcance real observado: canal `b2c`/`b2b`, validación de RUT/teléfonos CL, geocoding fallback cuando faltan coordenadas, portal público habilitable por flag y errores de negocio explícitos para cuentas corporativas
- dependencias externas: geocoding/maps, rate limit y backend/store
- entidades y flujos principales: visitante/empresa -> intake -> validación -> geocoding -> orden
- señales de modularidad: muy buen borde para un `order-intake-core` con variantes públicas y corporativas
- señales de acoplamiento o deuda: hoy mezcla reglas chilenas, store de Acargoo y reglas específicas de PO corporativa
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: route planning + geocoding fallback

- taxonomía: `geo, mapas y territorial`
- rutas clave: `lib/acargoo/domain/maps-public.ts`
- problema que resuelve: geocodificar direcciones y estimar rutas con fallback entre Google, OSM/OSRM y haversine
- alcance real observado: URLs/payloads de proveedores, decodificación polyline y plan de ruta con proveedor identificado
- dependencias externas: Google Geocoding, Google Routes, Nominatim, OSRM
- entidades y flujos principales: dirección -> geocoding -> route plan -> path
- señales de modularidad: dominio casi puro y desacoplado de la UI
- señales de acoplamiento o deuda: depende de fetch remoto y de API keys en runtime
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: live vehicle tracking para terceros

- taxonomía: `delivery y tracking`
- rutas clave: `lib/acargoo/domain/maps-public.ts`, `components/aplicaciones/acargoo/AcargooMap.tsx`
- problema que resuelve: mostrar unidades en movimiento, ruta y ETA en un mapa público u operativo
- alcance real observado: surface de mapa con auto-fit controlado, markers enriquecidos, geocoding y cálculo de ruta con fallback entre proveedores
- dependencias externas: Google Maps JS/API, Google Routes, Nominatim, OSRM
- entidades y flujos principales: vehículo -> coordenadas live -> marcador -> ruta/ETA -> vista pública
- señales de modularidad: el dominio geográfico ya venía separado de la UI y permitió formalizar `delivery/tracking-core` + `geo/route-planning-core` + `geo/map-surface-core`
- señales de acoplamiento o deuda: el realtime de posiciones sigue dependiendo del producto fuente y aún no quedó como adapter desacoplado de infraestructura
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble por familia`

## Módulo: operation model presets

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `lib/acargoo/domain/models.ts`, `app/api/acargoo/models/route.ts`
- problema que resuelve: cambiar el comportamiento global del negocio según modelo operativo activo, sin rehacer pricing, dispatch y pago por separado
- alcance real observado: presets `uber_cargo`, `corporate` e `hybrid`, con rollout controlado y resolución del modelo activo desde settings
- dependencias externas: ninguna en el core; la activación real se apoya en settings del store
- entidades y flujos principales: settings -> modelo activo -> presets de pricing/payment/dispatch
- señales de modularidad: dominio puro, claramente separado y con borde muy reconocible
- señales de acoplamiento o deuda: hoy los modelos están hardcodeados y pensados para el negocio actual
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: pricing corporativo por cuenta

- taxonomía: `pagos y checkout`
- rutas clave: `app/api/acargoo/b2b/accounts/[accountId]/pricing/route.ts`
- problema que resuelve: permitir reglas de precio y timing de pago distintas por cuenta corporativa sin romper el pricing base del producto
- alcance real observado: overrides por cuenta+servicio con `pricing_mode`, `payment_timing_override`, base, km, multiplicador y mínimo
- dependencias externas: Supabase en la implementación actual; el patrón reusable es el contrato de override por cuenta
- entidades y flujos principales: cuenta B2B -> servicio -> override de precio/pago -> cálculo operativo
- señales de modularidad: contrato muy claro y separado del pricing genérico
- señales de acoplamiento o deuda: hoy está atado a la tabla específica del producto y no se revisó toda la capa de aplicación corporativa
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: cuenta corporativa + SLA versionado

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `app/api/acargoo/b2b/accounts/route.ts`, `b2b/accounts/[accountId]/sla/route.ts`
- problema que resuelve: dar vida operativa a cuentas empresa con política de pago, límite de crédito, SLA activo y escalación por versión
- alcance real observado: creación/listado de cuentas, búsqueda por metadatos y versionado de SLA con desactivación del anterior
- dependencias externas: Supabase en la implementación actual
- entidades y flujos principales: cuenta empresa -> política de pago/crédito -> SLA activo -> operación B2B
- señales de modularidad: borde de dominio muy nítido para una futura familia `b2b-account-core`
- señales de acoplamiento o deuda: hoy todo está muy pegado al schema específico de Acargoo y a la UI/admin de ese producto
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: procurement B2B con contactos y purchase orders

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `app/api/acargoo/b2b/accounts/[accountId]/contacts/route.ts`, `b2b/accounts/[accountId]/po/route.ts`, `orders/route.ts`
- problema que resuelve: aterrizar una cuenta corporativa en personas autorizadas y POs vigentes para que el intake B2B no sea solo “empresa genérica”
- alcance real observado: contacto primario, permisos de solicitar/aprobar servicio, PO con vigencia, monto consumido, attachment requerido y validación al crear la orden
- dependencias externas: Supabase en la implementación actual
- entidades y flujos principales: cuenta empresa -> contacto -> PO -> solicitud B2B -> validación de compra
- señales de modularidad: patrón muy bueno de `enterprise intake guardrails`
- señales de acoplamiento o deuda: hoy está muy ligado a las tablas B2B concretas del producto
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: presencia live del conductor

- taxonomía: `delivery y tracking`
- rutas clave: `app/api/acargoo/drivers/[driverId]/presence/route.ts`, `lib/acargoo/data/store.ts`
- problema que resuelve: actualizar si un conductor está en turno y disponible sin mezclarlo con el tracking fino de coordenadas
- alcance real observado: `availabilityStatus` + `onShift` con permisos por actor y refresh de `last_seen_at`
- dependencias externas: store/backend en la persistencia actual
- entidades y flujos principales: conductor -> presencia -> dispatch y operación
- señales de modularidad: contrato mínimo, muy claro y útil en cualquier operación con flota
- señales de acoplamiento o deuda: hoy vive montado sobre el modelo de chofer actual de Acargoo
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: incident workflow + timeline agregado

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `app/api/acargoo/incidents/route.ts`, `orders/[orderId]/timeline/route.ts`, `lib/acargoo/data/store.ts`
- problema que resuelve: reportar incidentes operativos, evitar duplicados impulsivos y reconstruir una línea de tiempo completa de una orden
- alcance real observado: creación con guardas de idempotencia para driver, resolución de incidentes, timeline combinado de dispatch/tracking/incidentes/notificaciones/POD
- dependencias externas: store/backend en la implementación actual
- entidades y flujos principales: orden -> incidente -> resolución / timeline integral
- señales de modularidad: patrón fuerte de `order timeline aggregator` y de incidente operativo reusable
- señales de acoplamiento o deuda: hoy mezcla varias subfuentes del dominio Acargoo dentro del store central
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: assign flow con ranking y guardas de pago/estado

- taxonomía: `delivery y tracking`
- rutas clave: `app/api/acargoo/orders/[orderId]/assign/route.ts`, `lib/acargoo/data/store.ts`, `domain/dispatch.ts`, `state-machine.ts`
- problema que resuelve: asignar, autoasignar o desasignar una orden respetando ranking, pago pendiente y restricciones por estado
- alcance real observado: ranking consultable, `auto_nearest`, asignación manual, desasignación controlada y errores de negocio explícitos
- dependencias externas: store/backend en la implementación actual
- entidades y flujos principales: orden -> ranking -> assign/unassign -> transición válida
- señales de modularidad: patrón muy fuerte de `dispatch-assignment-flow`
- señales de acoplamiento o deuda: hoy se apoya fuerte en el store central del producto
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: lifecycle de pago y resumen operativo

- taxonomía: `pagos y checkout`
- rutas clave: `app/api/acargoo/payments/route.ts`, `payments/[paymentId]/route.ts`, `reports/summary/route.ts`, `lib/acargoo/data/store.ts`
- problema que resuelve: listar, actualizar y limpiar pagos operativos, además de resumir la salud general de la operación con revenue, órdenes activas e incidentes abiertos
- alcance real observado: filtro por `orderId/status`, transición a `paid` con timestamp, delete controlado y summary consolidado por status/driver/revenue/incidencias
- dependencias externas: store/backend en la implementación actual
- entidades y flujos principales: pago -> estado/cobranza -> resumen operativo
- señales de modularidad: patrón claro de `payment-lifecycle + ops-summary`
- señales de acoplamiento o deuda: hoy vive demasiado pegado al store central y a las entidades propias de Acargoo
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`
