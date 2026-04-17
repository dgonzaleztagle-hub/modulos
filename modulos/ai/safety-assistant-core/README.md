# ai/safety-assistant-core

Estado: usable inicial endurecido

## Fuentes

- `ceroriesgos`

## Propósito

Proveer un patrón portable para asistentes IA incrustados dentro de un flujo operativo, usando tipos de solicitud claros, prompts por tarea y salida estructurada en español.

## Qué resuelve hoy

- request types tipados para sugerencias, análisis, chat experto y generación de texto
- prompts base por tarea
- armado de mensajes de usuario desde contexto estructurado
- payload portable para gateways de chat completion

## Estado real

Ya sirve como base reusable.
Todavía falta cruzarlo con adapters reales de proveedor, observabilidad y guardrails por dominio.
