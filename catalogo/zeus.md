# zeus

Repo origen: `D:\proyectos\zeus`

## Módulo: pasarela Zeleri oneshot

- taxonomía: `pagos y checkout`
- rutas clave: `src/lib/zeleri.ts`, `zeleri-signature.js`, `src/app/checkout/*`
- problema que resuelve: crear órdenes, firmar requests HMAC y consultar estado de pagos en Zeleri
- alcance real observado: cliente de integración relativamente completo para checkout one-shot
- dependencias externas: API Zeleri, `crypto`
- entidades y flujos principales: orden -> firma -> checkout -> consulta detalle -> verificación pago
- señales de modularidad: librería de integración aislada y bien comentada
- señales de acoplamiento o deuda: usa variables de entorno y contratos propios de Zeleri, pero eso es normal
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: flujo Zeleri enrollment

- taxonomía: `pagos y checkout`
- rutas clave: `src/lib/zeleri.ts`, `src/app/api/zeus/enroll/route.ts`
- problema que resuelve: enrolar tarjeta, listar tarjetas de un cliente y cobrar/confirmar órdenes con tarjeta enrolada
- alcance real observado: create enrollment, list cards, create order by card y confirm order, además del bootstrap de reserva pending para servicios
- dependencias externas: API Zeleri, `crypto`
- entidades y flujos principales: cliente -> enrollment -> card list -> order -> confirm
- señales de modularidad: el cliente Zeleri ya trae funciones separadas y muy claras por endpoint
- señales de acoplamiento o deuda: el cleanup de booking y el fallback de producto siguen amarrados a Zeus; el core portable es el contrato con Zeleri
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: reconciliación de reservas bloqueadas por pago

- taxonomía: `reservas y agenda`
- rutas clave: `src/lib/booking-locks.ts`, `src/lib/payments.ts`, `src/lib/mercadopago.ts`
- problema que resuelve: mantener o liberar reservas pendientes según confirmación remota del pago
- alcance real observado: reconciliación con Zeleri y Mercado Pago, expiración por ventana de tiempo y actualización de estado
- dependencias externas: Zeleri, Mercado Pago, Supabase
- entidades y flujos principales: booking pendiente -> expiración -> consulta gateway -> paid/failed
- señales de modularidad: servicio claro de backend con una responsabilidad nítida
- señales de acoplamiento o deuda: está amarrado al schema `zeus_bookings` y al naming del producto
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: agenda de servicios

- taxonomía: `reservas y agenda`
- rutas clave: `src/app/agenda`, `seed_agenda_services_v1.0.sql`, `src/lib/payments.ts`
- problema que resuelve: catálogo de servicios y reservas con pago asociado
- alcance real observado: superficie pública de agenda y datos semilla para servicios
- dependencias externas: Next.js, Supabase
- entidades y flujos principales: servicio -> booking -> pago -> agenda/admin
- señales de modularidad: agenda visible como subdominio claro del producto
- señales de acoplamiento o deuda: parte importante del flujo está repartida entre app y libs
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: acceso digital post-compra

- taxonomía: `auth y tenants`
- rutas clave: `src/modules/digital-access/tokens.ts`
- problema que resuelve: habilitar acceso a activos digitales luego del pago
- alcance real observado: tokens de acceso desacoplados de la UI principal
- dependencias externas: ninguna evidente en la pasada actual
- entidades y flujos principales: compra -> token -> acceso
- señales de modularidad: módulo en carpeta `src/modules`
- señales de acoplamiento o deuda: falta ver capa completa de consumo y revocación
- madurez estimada: `medio`
- potencial de reutilización: `medio`
- observación de extracción: `requiere refactor`

## Módulo: selector de proveedor de pago

- taxonomía: `pagos y checkout`
- rutas clave: `src/components/PaymentProviderSwitch.tsx`, `MercadoPagoModal.tsx`, `src/modules/payments/mercadopago.ts`
- problema que resuelve: soportar más de un gateway en el mismo producto
- alcance real observado: coexistencia de Mercado Pago y Zeleri
- dependencias externas: Mercado Pago, Zeleri
- entidades y flujos principales: checkout -> proveedor -> confirmación
- señales de modularidad: capa de switch y adapters
- señales de acoplamiento o deuda: la decisión de proveedor parece cercana a la UI
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`
