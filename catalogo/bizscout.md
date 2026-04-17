# bizscout

Repo origen: `D:\proyectos\bizscout`

## Módulo: lead hunting y clasificación comercial

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/lib/api/leads.ts`, `src/hooks/useLeadsData.ts`, `src/pages/BuscarLeads.tsx`
- problema que resuelve: buscar leads por categoría/zona, clasificarlos con IA, geocodificarlos y extraer emails
- alcance real observado: invoke a funciones para `buscar-leads`, `clasificar-lead`, `geocodificar` y `extraer-email`
- dependencias externas: Supabase functions, Firecrawl/IA/geocoding según backend
- entidades y flujos principales: búsqueda -> lead -> clasificación -> enriquecimiento -> outreach
- señales de modularidad: cliente API bien definido y portable
- señales de acoplamiento o deuda: depende mucho de edge functions ya desplegadas y de vocabulario comercial concreto
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: search orchestration y deduplicación de prospectos

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `supabase/functions/buscar-leads/index.ts`, `src/pages/BuscarLeads.tsx`, `src/hooks/useLeadsData.ts`
- problema que resuelve: convertir una búsqueda comercial por categoría y zona en un lote usable de prospectos, evitando ruido y duplicados
- alcance real observado: genera múltiples variaciones de búsqueda, combina resultados de `places` y `web`, deduplica por dominio o nombre normalizado y registra la búsqueda como batch rastreable
- dependencias externas: Serper, Supabase functions, geocoding
- entidades y flujos principales: categoría/zona -> variaciones de query -> resultados combinados -> deduplicación -> `busqueda` -> leads persistidos
- señales de modularidad: pipeline bien recortado y separable de la UI
- señales de acoplamiento o deuda: categorías hardcodeadas y fuerte dependencia de proveedores externos
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: wizard de outreach WhatsApp

- taxonomía: `notificaciones y mensajería`
- rutas clave: `src/components/pluscontable/WizardEnvioWSP.tsx`, `PlantillasWSPPC.tsx`, `PanelEnvioEmail.tsx`
- problema que resuelve: orquestar envíos manuales/semi-asistidos por WhatsApp y email sobre lotes de leads
- alcance real observado: selección de plantilla, navegación lead por lead, apertura `wa.me` y marcado de contacto
- dependencias externas: WhatsApp deep links, sonner, hooks de datos
- entidades y flujos principales: leads seleccionados -> plantilla -> envío -> estado contactado
- señales de modularidad: wizard reconocible y reusable como patrón de outreach
- señales de acoplamiento o deuda: varias piezas están amarradas a datasets específicos de PlusContable/SuperPanel
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: ledger de contacto por canal

- taxonomía: `notificaciones y mensajería`
- rutas clave: `src/hooks/usePlusContableData.ts`, `src/hooks/useEmailData.ts`, `src/pages/Email.tsx`
- problema que resuelve: registrar qué lead ya fue tocado por WhatsApp, email o ambos, evitando repetir outreach ciego
- alcance real observado: `via_contacto`, `fecha_ultimo_contacto`, plantillas por canal y transición automática de estados al contactar
- dependencias externas: Supabase, Resend/función de email, WhatsApp deep links
- entidades y flujos principales: lead -> canal usado -> estado `contactado` -> historial/seguimiento
- señales de modularidad: reglas de canal y contacto bastante claras
- señales de acoplamiento o deuda: parte de la lógica sigue repartida entre hooks de verticales concretas
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: agenda comercial de seguimiento

- taxonomía: `reservas y agenda`
- rutas clave: `src/pages/Agenda.tsx`, `components/pluscontable/ScheduleModal.tsx`
- problema que resuelve: agendar seguimientos o contactos comerciales sobre leads
- alcance real observado: agenda y modal de programación asociados al CRM de leads
- dependencias externas: React
- entidades y flujos principales: lead -> agenda/recordatorio -> seguimiento
- señales de modularidad: dominio pequeño pero claro
- señales de acoplamiento o deuda: no se revisó el backend completo y parece convivir con varias verticales dentro del mismo repo
- madurez estimada: `medio`
- potencial de reutilización: `medio`
- observación de extracción: `solo referencia`

## Módulo: agenda nacida desde pipeline de prospección

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/pages/Resultados.tsx`, `src/pages/Agenda.tsx`, `src/hooks/useLeadsData.ts`
- problema que resuelve: promover leads detectados a seguimiento activo sin salir del mismo sistema
- alcance real observado: desde resultados se agregan a agenda con fecha futura; luego agenda filtra solo leads con seguimiento y los organiza por estado comercial
- dependencias externas: Supabase
- entidades y flujos principales: búsqueda -> resultados -> `A Agenda` -> seguimiento -> cierre o descarte
- señales de modularidad: workflow muy claro de embudo corto
- señales de acoplamiento o deuda: estados y categorías siguen definidos dentro del producto concreto
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`
