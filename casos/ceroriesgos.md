# Caso: ceroriesgos

## Tipo

`ai-workflow-operativo`

## Qué resolvió

- incrustar IA contextual dentro de flujos reales de accidentes, inspecciones y capacitaciones
- producir sugerencias, análisis y texto técnico sin sacar al usuario del flujo operativo
- conectar esa capa IA con documentos formales y seguimiento de medidas correctivas
- cerrar el ciclo operativo con evidencia fotográfica, firma y documentos emitibles

## Piezas que ya viven en `MODULOS`

- `ai/safety-assistant-core`
- `pdf/safety-report-outline-core`
- `ops/corrective-measure-tracker-core`
- `ops/five-whys-core`
- `ops/inspection-checklist-core`

## Repos de origen

- `ceroriesgos`

## Observaciones

- este caso no aporta una “IA genérica de chat”, sino un patrón mucho más valioso: IA embebida en workflow con tipos de solicitud claros y salida estructurada
- para `rishtedar` o cualquier operación futura, el aprendizaje reusable no es el dominio de seguridad laboral, sino la forma de meter IA en pantallas vivas con contexto real
- el gancho reusable aquí está en el hook central y en la taxonomía de solicitudes (`sugerir`, `analizar`, `chatear`, `generar texto`), porque eso permite repartir una misma IA entre varias superficies sin rehacer el backend
- también aporta un patrón fuerte de `workflow -> evidencia/firma -> PDF`, útil más allá de prevención de riesgos
