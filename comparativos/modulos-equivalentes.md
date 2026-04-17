# Módulos equivalentes y repetidos

## Auth y tenants

| patrón | repos | lectura |
| --- | --- | --- |
| multitenancy con features/límites | `pluscontable.cl`, `kurso`, `CorredoresPro` | patrón fuerte para un futuro módulo base de tenant config |
| multi-sucursal / negocio activo | `truckpos_new`, `rishtedar` | variante más operativa que SaaS clásico |
| onboarding con provisioning | `pluscontable.cl`, `kurso`, `truckpos_new`, `CorredoresPro` | alta reutilización, distinto vocabulario por vertical |

## Pagos y checkout

| patrón | repos | lectura |
| --- | --- | --- |
| Mercado Pago checkout + webhook | `rishtedar`, `pluscontable.cl`, `kurso`, `zeus`, `truckpos_new` | muy repetido, excelente candidato a módulo portable |
| gateway alternativo / multi-provider | `zeus`, parcialmente `hojacero` | valioso como adapter layer |
| billing SaaS | `kurso`, `pluscontable.cl` | ambos resuelven trial, renovación y estados comerciales |

## Delivery y tracking

| patrón | repos | lectura |
| --- | --- | --- |
| delivery core con estados | `acargoo`, `rishtedar`, `hojacero` | `acargoo` es el core más claro; `hojacero` y `rishtedar` agregan variantes food |
| tracking cliente/driver | `acargoo`, `rishtedar`, `hojacero` | patrón repetido con mezcla UI + dominio |
| pricing logístico | `acargoo`, parcialmente `rishtedar` | `acargoo` concentra la lógica más extraíble |

## Reservas y agenda

| patrón | repos | lectura |
| --- | --- | --- |
| agenda operativa | `hojacero`, `zeus` | agenda profesional vs agenda de servicios pagados |
| reservas con backoffice | `rishtedar`, `zeus` | alto potencial para un módulo base de booking |
| locking por pago | `zeus`, aplicable a `rishtedar` | patrón especialmente valioso |

## POS y operación

| patrón | repos | lectura |
| --- | --- | --- |
| caja / cash register | `truckpos_new`, `hojacero` | mismo problema con distinto nivel de madurez |
| inventario / catálogo / importación | `truckpos_new`, `hojacero`, `rishtedar` | oportunidad para separar catálogo y stock |
| tickets / kitchen / terminal POS | `truckpos_new`, `hojacero` | patrón muy reutilizable para food/POS |

## CRM, pipeline y backoffice

| patrón | repos | lectura |
| --- | --- | --- |
| pipeline visual y trabajo interno | `hojacero`, `CorredoresPro`, parcialmente `pluscontable.cl` | `hojacero` es la versión más sofisticada |
| dashboards operativos por vertical | `rishtedar`, `truckpos_new`, `pluscontable.cl`, `CorredoresPro` | conviene separar shell de dashboard de widgets por dominio |
| portales por actor | `CorredoresPro`, `acargoo`, `rishtedar` | owner/tenant/driver/staff comparten patrón de superficies por rol |
| cobranza con severidad y snapshot financiero | `CorredoresPro`, `pluscontable.cl`, parcialmente `acargoo` | patrón útil para backoffices donde el valor está en combinar pagos, riesgo y lectura operativa |
| workspace por proyecto con documento unificado | `agendaproyectos`, parcialmente `superpanel3.0` | patrón útil para hubs internos donde conviene operar todo desde una ficha agregada y no desde muchos submódulos |
| prospección geolocalizada con clasificación y agenda | `bizscout`, parcialmente `pluscontable.cl` | patrón muy valioso para embudos cortos B2B: buscar, deduplicar, clasificar, agendar y contactar |
| biblioteca privada con grants temporales | `zeus`, `caprex` | `zeus` aporta el ADN de acceso digital; `caprex` lo empuja hacia content commerce y cuentas compartidas |

## IA, chat y automatización

| patrón | repos | lectura |
| --- | --- | --- |
| AI chat embebido | `hojacero`, `pluscontable.cl`, `kurso`, `ceroriesgos` | patrón reusable, prompts y contexto cambian; `ceroriesgos` aporta mejor ejemplo de requests tipados dentro de workflow |
| orquestador de lógica conversacional | `hojacero` | módulo singular de alto valor, menos portable sin neutralizar copy |
| análisis asistido por modelo | `hojacero` territorial/radar | candidato premium, no necesariamente base para todos los proyectos |
| academy interna con progreso y certificación | `hojacero` | patrón útil para capacitación operativa, aunque hoy el contenido está totalmente teñido por Growth |

## CMS, landing y builders

| patrón | repos | lectura |
| --- | --- | --- |
| landing factory modular por secciones | `hojacero`, `superpanel3.0` | mismo linaje de edición/publicación, pero `superpanel3.0` lo baja a white-label por reseller |
| builder visual libre tipo canvas | `superpanel3.0` | candidato fuerte a motor reusable propio; no conviene mezclarlo con el editor seccional |
| catálogo inmersivo premium de producto | `apimiel`, parcialmente `donde-germain` | patrón más visual que operacional; útil como referencia para exhibición de productos con mayor carga de marca |

## Reportes, PDFs y exportación

| patrón | repos | lectura |
| --- | --- | --- |
| generadores PDF documentales | `pluscontable.cl`, `CorredoresPro`, `acargoo`, `ceroriesgos` | excelente oportunidad para toolkit de PDFs con branding; `ceroriesgos` aporta plantillas operativas muy aterrizadas |
| reportes operativos | `truckpos_new`, `rishtedar`, `hojacero` | conviene desacoplar templates de los datos |
| importación de catálogos y normalización | `truckpos_new`, `ICEBUIN` | patrón útil para separar parsing de archivos, detección de columnas y normalización de catálogo |
| evidencia + firma + documento final | `ceroriesgos`, parcialmente `CorredoresPro` | patrón potente para flujos donde el cierre necesita prueba, validación humana y PDF emitible |

## Integraciones externas

| patrón | repos | lectura |
| --- | --- | --- |
| publicación externa | `CorredoresPro` | valioso como blueprint de publisher |
| scrapers y POI | `hojacero` | fuerte pero más especializado |
| push/email | `acargoo`, `pluscontable.cl`, `kurso`, `hojacero` | patrón transversal para un notifications-kit |
| sincronización tributaria SII | `pluscontableapisii` | integración chilena muy clara para libros de compras/ventas; valiosa como satélite contable más que como core transversal global |

## Distinción sugerida para la siguiente fase

- `código portable`: pricing, state machine, payment grouping, billing helpers, PDF generators
- `patrón reusable`: onboarding multi-tenant, portal por actor, dashboard operativo por dominio
- `flujo de negocio`: booking locks, pipeline lead workspace, publisher inmobiliario, support inbox
- `referencia documental`: prospectos, landings específicas, UI muy de marca, copy comercial duro
