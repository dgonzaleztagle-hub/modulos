# truckpos_new

Repo origen: `D:\proyectos\truckpos_new`

## Módulo: control de caja en tiempo real

- taxonomía: `POS y operación`
- rutas clave: `src/hooks/useCashRegister.tsx`, `src/pages/Cash.tsx`, `supabase/migrations/*cash*`
- problema que resuelve: detectar caja abierta por negocio y reaccionar a cambios realtime
- alcance real observado: estado de caja por `business_id`, con subscripción a cambios Postgres
- dependencias externas: Supabase realtime
- entidades y flujos principales: negocio -> caja abierta/cerrada -> UI operativa
- señales de modularidad: hook autocontenido, consulta simple, reusable para POS
- señales de acoplamiento o deuda: depende de esquema Supabase y del `BusinessContext`
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: importador de productos desde Excel

- taxonomía: `POS y operación`
- rutas clave: `src/utils/productImport.ts`, `src/components/products/ProductImportDialog.tsx`
- problema que resuelve: poblar catálogo desde planillas con mapeo flexible de columnas
- alcance real observado: parser, normalización, boolean parsing y validación por fila
- dependencias externas: `xlsx`
- entidades y flujos principales: archivo excel -> filas -> productos parseados -> validación
- señales de modularidad: utilitario puro muy portable
- señales de acoplamiento o deuda: tipos pensados para el producto, pero fáciles de renombrar
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: tickets de cocina e impresión POS

- taxonomía: `POS y operación`
- rutas clave: `src/components/pos/KitchenTicket.tsx`, `PrintTicket.tsx`, `src/styles/print.css`
- problema que resuelve: representar comprobantes operativos para cocina y caja
- alcance real observado: componentes específicos para impresión y operación interna
- dependencias externas: `react-to-print`
- entidades y flujos principales: orden -> ticket visual -> impresión
- señales de modularidad: componentes separados del resto del panel
- señales de acoplamiento o deuda: la lógica de datos parece embebida en la UI
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: multi-sucursal y contexto de negocio

- taxonomía: `auth y tenants`
- rutas clave: `src/hooks/useBusinessContext.tsx`, `src/components/LocationSelector.tsx`, `src/pages/ManageLocations.tsx`, `supabase/functions/create-location`
- problema que resuelve: operar múltiples negocios o sucursales dentro del mismo entorno
- alcance real observado: selector de ubicación, creación de location y contexto de negocio activo
- dependencias externas: Supabase
- entidades y flujos principales: negocio -> location -> vistas filtradas
- señales de modularidad: responsabilidades relativamente claras entre context, pages y edge functions
- señales de acoplamiento o deuda: naming muy específico de producto y modelo de negocio
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: reportes y dashboard comercial

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `src/components/dashboard/*`, `src/pages/Reports.tsx`, `ConsolidatedReports.tsx`, `src/utils/exportReports.ts`
- problema que resuelve: métricas de venta, top productos y exportación de reportes
- alcance real observado: dashboards visuales y exportes para operación
- dependencias externas: `recharts`, librerías de exportación
- entidades y flujos principales: ventas / productos / horarios punta -> chart -> export
- señales de modularidad: utilitarios y componentes diferenciados
- señales de acoplamiento o deuda: acoplado a la estructura analítica del POS
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

Nota de rerevisión: desde este bloque ya quedó aterrizado `ops/report-dataset-core` como separación portable de la capa de exportación.

## Módulo: pagos con Mercado Pago y provisioning de negocio

- taxonomía: `pagos y checkout`
- rutas clave: `supabase/functions/process-mercadopago-payment`, `create-business-with-admin`, `create-user`
- problema que resuelve: alta de negocio y procesamiento de pago en edge functions
- alcance real observado: provisioning de tenants y cobro inicial dentro del producto
- dependencias externas: Supabase functions, Mercado Pago
- entidades y flujos principales: alta negocio -> admin -> pago procesado
- señales de modularidad: backend segregado en edge functions
- señales de acoplamiento o deuda: edge functions muy pegadas al onboarding del producto
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: kitchen/order notification hooks

- taxonomía: `notificaciones y mensajería`
- rutas clave: `src/hooks/useOrderNotifications.tsx`, `usePendingOrders.tsx`, `useInventoryNotifications.tsx`, `components/pos/KitchenTicket.tsx`
- problema que resuelve: alertar y vigilar órdenes pendientes, inventario sensible y eventos operativos del POS
- alcance real observado: hooks reactivos para order queue e inventario con foco en cocina/operación
- dependencias externas: Supabase realtime
- entidades y flujos principales: cambio en órdenes/inventario -> notificación local -> reacción operativa
- señales de modularidad: hooks especializados y separados por preocupación
- señales de acoplamiento o deuda: dependen del contexto de negocio y del schema concreto del POS
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: mesas y floor operation

- taxonomía: `POS y operación`
- rutas clave: `src/pages/Tables.tsx`, `src/components/ui/table.tsx`
- problema que resuelve: representar y gestionar operación de salón/mesas dentro del POS
- alcance real observado: superficie dedicada a mesas como parte del flujo operativo food
- dependencias externas: React
- entidades y flujos principales: mesa -> estado -> atención/orden
- señales de modularidad: dominio reconocible y separado por página
- señales de acoplamiento o deuda: no se revisó la capa de datos profunda y puede estar pegado al resto del panel
- madurez estimada: `medio`
- potencial de reutilización: `medio`
- observación de extracción: `solo referencia`

## Módulo: menú QR y tracking público de pedido

- taxonomía: `CMS, landing y contenido`
- rutas clave: `src/pages/MenuQR.tsx`, `src/pages/MenuTrack.tsx`, `src/pages/Menu.tsx`
- problema que resuelve: publicar menú por slug, generar QR y dar seguimiento público a pedidos web
- alcance real observado: QR descargable, URL pública de menú, tracker realtime por código y notificación cuando el pedido está listo
- dependencias externas: Supabase realtime, QR generator, Web Audio API
- entidades y flujos principales: negocio/slug -> menú público -> pedido web -> código -> tracking para cliente final
- señales de modularidad: la superficie pública está bastante separada del backoffice POS
- señales de acoplamiento o deuda: depende de slugs, schema de órdenes y branding del producto final
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: cash close reminder

- taxonomía: `notificaciones y mensajería`
- rutas clave: `src/hooks/useCashCloseReminder.tsx`
- problema que resuelve: recordar al operador el cierre de caja con semáforo temporal antes del horario programado
- alcance real observado: alertas a 15, 10 y 5 minutos, reset con cambios realtime y aviso posterior al vencimiento
- dependencias externas: Supabase realtime, toast local
- entidades y flujos principales: caja abierta -> hora programada -> ventanas de alerta -> cierre
- señales de modularidad: hook puro de política temporal, fácil de mover a otros POS
- señales de acoplamiento o deuda: hoy usa directamente el schema `cash_register` y el contexto del negocio activo
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: payment config watcher por negocio

- taxonomía: `pagos y checkout`
- rutas clave: `src/hooks/usePaymentConfig.tsx`, `src/components/PaymentConfigDialog.tsx`
- problema que resuelve: habilitar o bloquear medios de pago según la configuración viva del negocio
- alcance real observado: lectura y refresh realtime de configuración Mercado Pago por `business_id`
- dependencias externas: Supabase realtime
- entidades y flujos principales: negocio -> config de pagos -> POS/menu/pedido habilitado o no
- señales de modularidad: hook pequeño y reusable como policy watcher
- señales de acoplamiento o deuda: hoy solo mira Mercado Pago y el schema del producto
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Veredicto

- `truckpos_new` sí termina de cerrar bien el frente POS/food: no solo caja e inventario, también superficie pública QR, tracking web de pedido, recordatorios de cierre y config viva de pagos
- desde aquí ya no espero otra familia grande escondida; lo que quedaría sería más detalle de implementación que nuevos motores
