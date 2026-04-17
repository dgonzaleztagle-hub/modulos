# pluscontable.cl

Repo origen: `D:\proyectos\pluscontable.cl`

## Módulo: multitenancy con features, límites y branding

- taxonomía: `auth y tenants`
- rutas clave: `src/contexts/TenantContext.tsx`, `src/hooks/useTenantFeatures.ts`, `useTenantLimits.ts`, `useTenantBranding.ts`, `useSubdomainDetection.ts`
- problema que resuelve: habilitar una experiencia multi-tenant con subdominio, branding y gating funcional
- alcance real observado: detección de tenant, features por tenant, límites de plan y branding inyectable
- dependencias externas: React, Supabase
- entidades y flujos principales: host/subdominio -> tenant -> features/límites/branding
- señales de modularidad: hooks y contexto bien separados
- señales de acoplamiento o deuda: algunos defaults freemium están hardcodeados y dependen del contexto actual
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: onboarding de tenant y auto-registro

- taxonomía: `auth y tenants`
- rutas clave: `src/components/onboarding/TenantOnboarding.tsx`, `src/pages/TenantRegistration.tsx`, `supabase/functions/register-tenant`
- problema que resuelve: dar de alta tenants y preparar su espacio
- alcance real observado: flujo de registro y provisioning desde edge functions
- dependencias externas: Supabase functions
- entidades y flujos principales: registro -> tenant -> configuración inicial
- señales de modularidad: separación entre UI de onboarding y backend
- señales de acoplamiento o deuda: ligado a planes y nomenclatura contable de Pluscontable
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: generación documental RRHH y honorarios

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `src/lib/honorariosPdfGenerator.ts`, `contractGenerator.ts`, `workerEventsPdfGenerator.ts`, `cotizacionesPdfGenerator.ts`
- problema que resuelve: generar documentos formales PDF con branding del tenant
- alcance real observado: estados de cuenta, contratos y exportes documentales para RRHH/honorarios
- dependencias externas: `jspdf`
- entidades y flujos principales: datos cliente/tenant -> plantilla -> PDF final
- señales de modularidad: librerías puras relativamente autocontenidas
- señales de acoplamiento o deuda: textos, plantillas y campos responden a la vertical contable
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: Mercado Pago y cambios de plan

- taxonomía: `pagos y checkout`
- rutas clave: `src/hooks/useMercadoPago.ts`, `src/components/MercadoPagoButton.tsx`, `supabase/functions/mercadopago-checkout`, `mercadopago-webhook`, `process-plan-changes`
- problema que resuelve: cobrar, confirmar y aplicar cambios de plan/estado comercial
- alcance real observado: checkout, webhook y pipeline de actualización comercial
- dependencias externas: Mercado Pago, Supabase functions
- entidades y flujos principales: tenant -> checkout -> webhook -> plan actualizado
- señales de modularidad: backend segregado y hooks/UI independientes
- señales de acoplamiento o deuda: amarrado al lifecycle comercial del SaaS contable
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: AI chat y robot persistente

- taxonomía: `IA, chat y automatización`
- rutas clave: `src/components/AIChat.tsx`, `PermanentRobot.tsx`, `Robot3D.tsx`, `supabase/functions/ai-super-chat`, `chat-grok`
- problema que resuelve: asistencia AI permanente dentro del producto
- alcance real observado: UI de chat y funciones remotas para conversación
- dependencias externas: modelos AI, Supabase functions
- entidades y flujos principales: usuario -> chat -> edge function -> respuesta
- señales de modularidad: integración aislada por función y componente
- señales de acoplamiento o deuda: probablemente depende del contexto funcional del SaaS
- madurez estimada: `medio`
- potencial de reutilización: `medio`
- observación de extracción: `requiere refactor`

## Módulo: mensajería y notificaciones internas

- taxonomía: `notificaciones y mensajería`
- rutas clave: `src/components/MessagingDialog.tsx`, `MassNotificationDialog.tsx`, `NotificationBell.tsx`, `supabase/functions/send-email`
- problema que resuelve: notificar clientes o usuarios desde el panel
- alcance real observado: diálogo de mensajería, mass notifications y canal email
- dependencias externas: correo y Supabase functions
- entidades y flujos principales: mensaje -> destinatarios -> dispatch
- señales de modularidad: piezas visibles y separadas
- señales de acoplamiento o deuda: reglas de destinatario parecen específicas del producto
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: academy operativa por tenant

- taxonomía: `IA, chat y automatización`
- rutas clave: `src/lib/academiaContent.ts`, `src/lib/academiaQuestions.ts`, `src/pages/Academia*.tsx`, `src/components/academia/*`
- problema que resuelve: entrenar usuarios del tenant con módulos, tests y rutas relacionadas al producto
- alcance real observado: contenido tipado, duración, orden secuencial, preguntas y superficies dedicadas para academia
- dependencias externas: React Router; el core es mayormente contenido + progresión
- entidades y flujos principales: módulo -> contenido -> test -> avance de usuario
- señales de modularidad: la academia está bastante separada de RRHH y del billing
- señales de acoplamiento o deuda: el contenido sigue completamente teñido por Plus Contable y su vertical
- madurez estimada: `medio`
- potencial de reutilización: `medio`
- observación de extracción: `solo referencia`

## Módulo: tablero liviano de tareas internas

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/pages/TareasInternas.tsx`, `src/components/NuevaTareaDialog.tsx`
- problema que resuelve: operar checklist interno con cliente opcional, plazo y semáforo de urgencia
- alcance real observado: filtros por estado/cliente, semaforización por vencimiento y cierre/reapertura rápida
- dependencias externas: Supabase
- entidades y flujos principales: tarea -> plazo -> estado -> foco operativo diario
- señales de modularidad: el patrón de checklist es claro y no depende de la vertical contable para existir
- señales de acoplamiento o deuda: hoy sigue pegado al schema y al shell del producto
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Veredicto

- `pluscontable.cl` ya no solo aporta tenancy y PDFs; también confirma una familia bastante sólida de operación SaaS chilena con onboarding, documentos, billing, academia y tareas internas
- lo que vale aquí no es seguir buscando features chicas, sino asumir que ya cerró bien su aporte al stack base

## Módulo: tenant experience shell

- taxonomía: `auth y tenants`
- rutas clave: `src/contexts/TenantContext.tsx`, `src/components/layout/TenantLayout.tsx`, `src/components/landing/TenantLanding.tsx`, `src/hooks/useTenantNavigation.ts`
- problema que resuelve: montar una experiencia completa por tenant con branding, shell privado y landing pública
- alcance real observado: título/favicon dinámicos, landing por tenant, navegación condicionada y estado comercial del tenant
- dependencias externas: React Router, Supabase
- entidades y flujos principales: slug/subdominio -> tenant -> shell privado/público -> navegación/gating
- señales de modularidad: capa de experiencia separada de la lógica contable
- señales de acoplamiento o deuda: copy, campos y estados aún muy ligados al negocio contable
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: RRHH ingestion y previews documentales

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `src/components/UploadPayrollDialog.tsx`, `UploadDocumentDialog.tsx`, `DocumentPreviewDialog.tsx`, `PDFPreviewDialog.tsx`, `WorkerDocumentsDialog.tsx`
- problema que resuelve: subir documentos de personal, previsualizarlos y conectarlos con generación/exportación
- alcance real observado: pipeline UI para nóminas, previews y documentos por trabajador
- dependencias externas: storage, React
- entidades y flujos principales: archivo/documento -> preview -> asociación RRHH -> export o consulta
- señales de modularidad: bloque funcional bien reconocible junto a los generadores PDF
- señales de acoplamiento o deuda: depende de nomenclatura RRHH y modelos del SaaS actual
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: links temporales de registro de trabajador

- taxonomía: `auth y tenants`
- rutas clave: `src/components/GenerateWorkerLinkDialog.tsx`
- problema que resuelve: emitir enlaces temporales para que trabajadores completen su ficha de ingreso
- alcance real observado: token UUID, expiración por días y construcción de URL pública de onboarding
- dependencias externas: Supabase para persistencia; el core de link es puro
- entidades y flujos principales: cliente -> token -> expiración -> URL de registro
- señales de modularidad: la regla de generación está claramente separable de la UI
- señales de acoplamiento o deuda: la persistencia y el diálogo siguen pegados al producto
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: employment contract outline + anexo

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `src/lib/contractGenerator.ts`
- problema que resuelve: estructurar contrato laboral chileno y anexo sin depender del renderer DOCX
- alcance real observado: cargo, vigencia, jornada, remuneración, gratificación, previsión y firmantes
- dependencias externas: ninguna en el outline; el origen usa `docx` solo para render
- entidades y flujos principales: trabajador + empleador -> outline contrato -> anexo
- señales de modularidad: cláusulas y secciones separables del renderer
- señales de acoplamiento o deuda: copy legal y nomenclatura laboral chilena incrustados
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: worker events compensation

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `src/lib/workerEventsPdfGenerator.ts`
- problema que resuelve: valorizar horas extras, atrasos, faltas y anticipos para RRHH
- alcance real observado: fórmulas de impacto económico y resumen por tipo de evento
- dependencias externas: ninguna en la lógica financiera; el origen usa `jspdf` solo para render final
- entidades y flujos principales: evento -> metadata -> impacto -> resumen RRHH
- señales de modularidad: parte valórica pura y bastante aislable
- señales de acoplamiento o deuda: el archivo original mezcla cálculo con composición visual PDF
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: service quote outline

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `src/lib/cotizacionServicioPdfGenerator.ts`
- problema que resuelve: estructurar propuestas de servicios con detalle valorizado, validez comercial e información del prospecto
- alcance real observado: propuesta comercial, contenido enriquecido, totales afectos/exentos e IVA
- dependencias externas: ninguna en el outline; el origen usa `jspdf` y DOM solo para render
- entidades y flujos principales: prospecto + propuesta + items -> outline comercial -> PDF o correo
- señales de modularidad: el contenido, los subtotales y la metadata comercial se separan bien del render
- señales de acoplamiento o deuda: algunos textos siguen muy marcados por la operación comercial del tenant actual
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: honorarios account outline

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `src/lib/honorariosPdfGenerator.ts`
- problema que resuelve: resumir estado de cuenta de honorarios por período, saldo previo y estado de cobranza
- alcance real observado: cliente, período, total con arrastre, estado y mensaje de pago
- dependencias externas: ninguna en el outline; el origen usa `jspdf` solo para render
- entidades y flujos principales: cliente + período + saldo -> estado de cuenta -> documento o vista
- señales de modularidad: totales y estado financiero son puros y fácilmente reusables
- señales de acoplamiento o deuda: el texto de cobranza sigue orientado a una operación contable chilena
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: social security report outline

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `src/lib/cotizacionesPdfGenerator.ts`
- problema que resuelve: consolidar cotizaciones previsionales por empresa y por cartera completa
- alcance real observado: resumen por trabajadores pagados/pendientes y consolidado multiempresa
- dependencias externas: ninguna en el outline; el origen usa `jspdf` y `formatRut` en la etapa visual
- entidades y flujos principales: empresa/trabajadores -> resumen previsional -> informe unitario o general
- señales de modularidad: la estructura de resumen y filas es muy separable del renderer
- señales de acoplamiento o deuda: la nomenclatura previsional sigue centrada en el caso chileno
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`
