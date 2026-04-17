# Caso: bizscout

## Tipo

`crm-operativo`

## Qué resolvió

- búsqueda geolocalizada de prospectos por vertical
- deduplicación y consolidación de resultados desde múltiples queries
- clasificación IA para priorizar oportunidad comercial
- enriquecimiento con email y metadatos mínimos de contacto
- promoción directa desde resultados a agenda de seguimiento
- outreach semiasistido por WhatsApp y email con plantillas y rastro por canal

## Piezas que ya viven en `MODULOS`

- `crm/lead-hunting-core`
- `crm/outreach-message-core`
- `notifications/whatsapp-template-kit`
- `notifications/order-update-email-core`

## Repos de origen

- `bizscout`

## Observaciones

- vale mucho más como motor de prospección y seguimiento corto que como simple dashboard
- lo más reusable no es la UI, sino el pipeline `buscar -> clasificar -> enriquecer -> agendar -> contactar`
