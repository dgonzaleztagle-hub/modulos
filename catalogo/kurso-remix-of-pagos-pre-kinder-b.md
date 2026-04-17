# kurso / remix-of-pagos-pre-kinder-b

Repo origen: `D:\proyectos\kurso\remix-of-pagos-pre-kinder-b`

## Módulo: billing SaaS para tenant escolar

- taxonomía: `auth y tenants`
- rutas clave: `src/lib/saasBilling.ts`, `supabase/functions/check-subscriptions`, `mercadopago-checkout`, `setup_subscription_cron`
- problema que resuelve: definir trial, renovación intro, renovación estándar y estado comercial del tenant
- alcance real observado: pricing stage, CTA comercial, días restantes y estados de bloqueo
- dependencias externas: Mercado Pago, cron/backend Supabase
- entidades y flujos principales: tenant -> estado suscripción -> oferta -> cobro/renovación
- señales de modularidad: librería muy clara y reusable
- señales de acoplamiento o deuda: naming escolar y tipos `Tenant` del repo
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: agrupación de pagos y cuota escolar

- taxonomía: `pagos y checkout`
- rutas clave: `src/lib/paymentGrouping.ts`, `creditAccounting.ts`
- problema que resuelve: agrupar pagos consecutivos por alumno y período escolar para presentación o reporting
- alcance real observado: normalización de meses, agrupación por folio y construcción de conceptos
- dependencias externas: ninguna
- entidades y flujos principales: pagos crudos -> agrupación -> metadatos de display
- señales de modularidad: lógica pura y bien encapsulada
- señales de acoplamiento o deuda: depende del calendario escolar y del vocabulario `cuota`
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: expansión de notificaciones de pago en asientos

- taxonomía: `pagos y checkout`
- rutas clave: `supabase/functions/_shared/paymentNotificationEntries.ts`
- problema que resuelve: convertir una notificación de pago en entradas aprobables por actividad y mensualidad con período escolar compacto
- alcance real observado: normalización de meses, armado de conceptos y separación de pagos mixtos
- dependencias externas: ninguna
- entidades y flujos principales: pago notificado -> deudas seleccionadas -> filas de aprobación
- señales de modularidad: lógica pura, fácil de portar a backend o panel operativo
- señales de acoplamiento o deuda: vocabulario y calendario escolar todavía vienen incrustados en el core
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: multitenancy escolar con branding público

- taxonomía: `auth y tenants`
- rutas clave: `src/contexts/TenantContext.tsx`, `src/lib/branding.ts`, `supabase/functions/public-branding`
- problema que resuelve: personalizar la experiencia pública y privada por curso/colegio
- alcance real observado: branding tenant, layouts diferenciados y páginas públicas
- dependencias externas: Supabase
- entidades y flujos principales: tenant -> branding -> portal/páginas
- señales de modularidad: existe borde claro entre branding y resto del producto
- señales de acoplamiento o deuda: shape y copy muy orientados a centro de padres/curso
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: onboarding público de alumnos/apoderados

- taxonomía: `auth y tenants`
- rutas clave: `src/pages/PublicStudentOnboarding.tsx`, `supabase/functions/public-student-onboarding`, `create-parent-user`, `create-student-accounts`
- problema que resuelve: crear cuentas relacionadas desde un enlace o flujo público
- alcance real observado: relación alumno-apoderado, permisos y creación de usuarios enlazados
- dependencias externas: Supabase auth/functions
- entidades y flujos principales: link público -> identificación -> cuentas asociadas
- señales de modularidad: backend por función bien separado
- señales de acoplamiento o deuda: muy dependiente del modelo de roles escolar
- madurez estimada: `alto`
- potencial de reutilización: `medio`
- observación de extracción: `requiere refactor`

## Módulo: soporte e inbox operativo

- taxonomía: `notificaciones y mensajería`
- rutas clave: `src/lib/supportTickets.ts`, `src/pages/SupportInbox.tsx`, `supabase/functions/submit-support-request`, `reply-support-ticket`, `update-support-ticket-status`
- problema que resuelve: gestionar tickets de soporte dentro del SaaS
- alcance real observado: submit, listado, detalle, reply y cambio de estado
- dependencias externas: Supabase functions
- entidades y flujos principales: solicitud -> ticket -> inbox -> respuesta
- señales de modularidad: dominio coherente y bien separado
- señales de acoplamiento o deuda: workflows definidos para este producto específico
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: formularios y flujos administrativos

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/pages/FormBuilder.tsx`, `FormList.tsx`, `FormResponses.tsx`, `src/types/forms.ts`
- problema que resuelve: crear y explotar formularios para gestión interna
- alcance real observado: builder, listado y respuestas
- dependencias externas: React, Supabase
- entidades y flujos principales: formulario -> publicación -> respuestas
- señales de modularidad: módulo funcional relativamente bien delimitado
- señales de acoplamiento o deuda: faltó revisar el backend en profundidad en esta fase
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: onboarding kit auto-provisioning

- taxonomía: `auth y tenants`
- rutas clave: `SAAS_ONBOARDING_KIT.md`, `STEP2_get_tenant.sql`, `STEP3_create_student.sql`
- problema que resuelve: dejar un flujo reusable para completar perfil, crear tenant y asignar ownership después del registro
- alcance real observado: RPC `create_own_tenant`, checklist de integración y componente de onboarding premium documentado
- dependencias externas: Supabase auth/RPC, React
- entidades y flujos principales: registro -> perfil -> tenant propio -> refresh contexto
- señales de modularidad: está pensado explícitamente como kit portable
- señales de acoplamiento o deuda: todavía vive más como documentación/receta que como paquete de código centralizado
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`
