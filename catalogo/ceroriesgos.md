# ceroriesgos

Repo origen: `D:\proyectos\ceroriesgos`

## Módulo: safety AI assistant pattern

- taxonomía: `IA, chat y automatización`
- rutas clave: `src/hooks/useAIAssistant.ts`, `supabase/functions/ai-assistant/index.ts`
- problema que resuelve: incrustar un asistente IA contextual dentro de un flujo operativo, con tipos de consulta predefinidos y salida estructurada
- alcance real observado: sugerencia de medidas, análisis de patrones, chat experto CPHS y generación de texto técnico sobre seguridad laboral chilena
- dependencias externas: Supabase Edge Functions, gateway Lovable, modelo Gemini, prompts especializados por caso de uso
- entidades y flujos principales: UI -> `type` de solicitud -> system prompt especializado -> respuesta estructurada -> reutilización en módulo operativo
- señales de modularidad: hook claro, contrato de request simple y separación limpia entre cliente y función serverless
- señales de acoplamiento o deuda: el conocimiento está muy amarrado al dominio CPHS/chile y hoy depende de un gateway específico
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: AI workflow routing tipado

- taxonomía: `IA, chat y automatización`
- rutas clave: `src/hooks/useAIAssistant.ts`, `supabase/functions/ai-assistant/index.ts`, `src/components/AISuggestMeasures.tsx`
- problema que resuelve: usar una sola puerta de entrada IA para varias pantallas operativas sin multiplicar integraciones ad hoc
- alcance real observado: `suggest_measures`, `analyze_patterns`, `chat_cphs` y `generate_text`, cada uno con prompt especializado y contexto distinto
- dependencias externas: Supabase Edge Functions, gateway Lovable, Gemini
- entidades y flujos principales: pantalla operativa -> `type` IA -> prompt especializado -> salida estructurada -> inserción en flujo
- señales de modularidad: contrato muy limpio entre frontend y backend IA
- señales de acoplamiento o deuda: vocabulario de request y prompts aún muy sesgados al dominio de seguridad laboral chilena
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: safety PDF report kit

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `src/lib/pdf/accidentPdf.ts`, `src/lib/pdf/inspectionPdf.ts`, `src/lib/pdf/trainingPdf.ts`
- problema que resuelve: generar informes PDF formales para accidentes, inspecciones y capacitaciones con estructura repetible y branding documental coherente
- alcance real observado: encabezados por tipo de documento, tablas con `jspdf-autotable`, resúmenes, análisis 5 por qué y firmas de asistencia
- dependencias externas: `jspdf`, `jspdf-autotable`, `date-fns`
- entidades y flujos principales: dataset operativo -> plantilla PDF por rubro -> tablas/resúmenes -> descarga del documento
- señales de modularidad: funciones separadas por tipo de informe, contratos claros de entrada y patrón repetible de renderizado
- señales de acoplamiento o deuda: etiquetas, textos y estructura están sesgados a prevención de riesgos y normativa chilena
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: evidencia y firma para workflows operativos

- taxonomía: `reportes, PDFs y exportación`
- rutas clave: `src/components/EvidenceUpload.tsx`, `src/components/SignaturePad.tsx`, `src/pages/accidents/AccidentForm.tsx`, `src/lib/pdf/trainingPdf.ts`
- problema que resuelve: capturar evidencia visual y firmas digitales directamente dentro del flujo antes de emitir documentos o cerrar registros
- alcance real observado: fotos ligadas a accidentes, pad de firma en canvas y uso de firmas dentro del PDF de capacitaciones
- dependencias externas: Supabase storage/tablas para evidencia, canvas nativo, jsPDF
- entidades y flujos principales: registro operativo -> evidencia/firma -> persistencia -> PDF final
- señales de modularidad: el patrón es portable y aparece con responsabilidades claras
- señales de acoplamiento o deuda: hoy está repartido entre formularios concretos y no como toolkit único
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: corrective measures tracker

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/pages/Dashboard.tsx`, `src/pages/accidents/AccidentForm.tsx`, `src/pages/inspections/InspectionForm.tsx`
- problema que resuelve: unificar, ordenar y resumir medidas correctivas provenientes de accidentes e inspecciones
- alcance real observado: merge de pendientes, orden por deadline, vista dashboard y seguimiento por estado/responsable
- dependencias externas: ninguna en la lógica base; el integrador real conecta tablas distintas
- entidades y flujos principales: accidente/inspección -> medida correctiva -> dashboard de pendientes -> seguimiento operativo
- señales de modularidad: patrón muy claro, repetido y portable a otros dominios de compliance u operación
- señales de acoplamiento o deuda: hoy nace de dos tablas distintas y no de un modelo unificado
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: five whys / root cause analysis

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/components/FiveWhysAnalysis.tsx`, `src/pages/accidents/AccidentForm.tsx`, `src/pages/accidents/AccidentDetail.tsx`
- problema que resuelve: estructurar análisis de causa raíz con una secuencia de 5 porqués y una conclusión explícita
- alcance real observado: captura guiada, visualización y reutilización en informes de accidente
- dependencias externas: ninguna en la lógica base
- entidades y flujos principales: evento -> 5 porqués -> causa raíz -> medidas correctivas / informe
- señales de modularidad: muy portable, con forma estable y valor transversal para incidentes y postmortems
- señales de acoplamiento o deuda: hoy está narrado en clave de accidente laboral
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: inspection checklist engine

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/components/InspectionChecklist.tsx`, `src/pages/inspections/InspectionForm.tsx`, `src/pages/inspections/InspectionDetail.tsx`
- problema que resuelve: aplicar plantillas de checklist a inspecciones, capturar cumplimiento y consolidar observaciones por ítem
- alcance real observado: carga de template, inicialización de resultados, estados `cumple/no_cumple/no_aplica`, agrupación por categoría y resumen visual
- dependencias externas: ninguna en la lógica base; el integrador resuelve storage de plantillas y resultados
- entidades y flujos principales: template -> resultados -> observaciones -> resumen de inspección
- señales de modularidad: fuerte, con shape de datos estable y totalmente portable
- señales de acoplamiento o deuda: hoy está narrado para inspecciones de seguridad y no como checklist genérico
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Observación para `rishtedar`

- este repo no aporta una IA “lista para copiar” a restaurante, pero sí un patrón muy útil de `AI embedded in workflow`: tipos de solicitud, prompts especializados por tarea y salida estructurada según contexto
- una parte de esa lógica ya vive en `MODULOS` como base reusable, pero todavía queda pendiente neutralizar mejor el vocabulario de dominio si se quiere volver totalmente transversal
- la pieza más valiosa para futuro restaurante no es el chatbot flotante en sí, sino el hook central que permite que varias pantallas compartan el mismo backend IA con modos especializados
- además deja una pista útil para cualquier producto futuro que necesite cerrar ciclos con soporte documental: evidencia, firma y PDF dentro del mismo flujo
