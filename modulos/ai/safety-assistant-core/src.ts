export type SafetyAssistantRequestType =
  | "suggest_measures"
  | "analyze_patterns"
  | "chat_cphs"
  | "generate_text";

export interface SafetyAssistantRequest {
  type: SafetyAssistantRequestType;
  context: Record<string, unknown>;
}

export interface SafetyGatewayConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  maxTokens?: number;
}

export interface SafetyChatMessage {
  role: "system" | "user";
  content: string;
}

export interface SafetyGatewayPayload {
  model: string;
  messages: SafetyChatMessage[];
  stream: boolean;
  max_tokens: number;
}

export const SAFETY_SYSTEM_PROMPTS: Record<SafetyAssistantRequestType, string> = {
  suggest_measures: `Eres un experto en seguridad laboral chilena especializado en prevencion de riesgos.
Tu tarea es sugerir medidas correctivas y preventivas basadas en la informacion del accidente.

Responde SIEMPRE en espanol y con formato estructurado:
- Lista de 3-5 medidas correctivas concretas y accionables
- Cada medida debe incluir: que hacer, quien deberia ser responsable (cargo generico), y plazo sugerido
- Prioriza medidas que aborden la causa raiz
- Considera la normativa chilena (Ley 16.744, DS 594)`,

  analyze_patterns: `Eres un analista de seguridad laboral experto en identificar patrones y tendencias.
Analiza los datos proporcionados y genera insights accionables.

Responde SIEMPRE en espanol con:
- 2-3 observaciones clave sobre tendencias
- 1-2 areas de mayor riesgo identificadas
- 1-2 recomendaciones estrategicas
- Usa datos especificos cuando esten disponibles`,

  chat_cphs: `Eres un asistente experto en normativa chilena de seguridad laboral y Comites Paritarios de Higiene y Seguridad (CPHS).

Tu conocimiento incluye:
- Ley 16.744
- DS 54
- DS 44
- DS 594

Responde SIEMPRE en espanol, de forma clara y practica.
Si no estas seguro de algo, indicalo y sugiere consultar la fuente oficial.`,

  generate_text: `Eres un redactor tecnico especializado en informes de seguridad laboral.
Tu tarea es generar textos profesionales para informes de accidentes, inspecciones o capacitaciones.

El texto debe ser:
- formal pero claro
- tecnicamente preciso
- orientado a cumplimiento normativo
- en espanol`,
};

export function buildSafetyUserMessage(request: SafetyAssistantRequest): string {
  const { type, context } = request;

  switch (type) {
    case "suggest_measures":
      return [
        "Analiza este accidente y sugiere medidas correctivas:",
        `- Tipo: ${context.accident_type || "No especificado"}`,
        `- Descripcion: ${context.description || "No disponible"}`,
        `- Tipo de lesion: ${context.injury_type || "No especificado"}`,
        `- Ubicacion: ${context.location || "No especificada"}`,
        `- Analisis 5 Por Ques: ${context.root_cause || "No realizado"}`,
      ].join("\n");

    case "analyze_patterns":
      return [
        "Analiza estos datos de seguridad laboral:",
        `- Total accidentes: ${context.total_accidents || 0}`,
        `- Dias perdidos: ${context.total_lost_days || 0}`,
        `- Accidentes por tipo: ${JSON.stringify(context.accidents_by_type || {})}`,
        `- Inspecciones realizadas: ${context.total_inspections || 0}`,
        `- Hallazgos criticos: ${context.critical_findings || 0}`,
        `- Medidas pendientes: ${context.pending_measures || 0}`,
        `- Capacitaciones realizadas: ${context.total_trainings || 0}`,
      ].join("\n");

    case "chat_cphs":
      return String(context.message || "Hola");

    case "generate_text":
      return [
        `Genera un texto para: ${context.text_type || "informe"}`,
        `Contexto: ${JSON.stringify(context.data || {})}`,
        `Instruccion especifica: ${context.instruction || "Genera un texto profesional"}`,
      ].join("\n");

    default:
      return "Solicitud no soportada";
  }
}

export function buildSafetyChatMessages(request: SafetyAssistantRequest): SafetyChatMessage[] {
  return [
    { role: "system", content: SAFETY_SYSTEM_PROMPTS[request.type] },
    { role: "user", content: buildSafetyUserMessage(request) },
  ];
}

export function buildSafetyGatewayPayload(
  config: SafetyGatewayConfig,
  request: SafetyAssistantRequest,
): SafetyGatewayPayload {
  return {
    model: String(config.model || "").trim(),
    messages: buildSafetyChatMessages(request),
    stream: false,
    max_tokens: config.maxTokens ?? 1000,
  };
}

export function normalizeSafetyAssistantResponse(raw: unknown): string {
  if (typeof raw === "string") {
    return raw.trim();
  }

  if (raw && typeof raw === "object") {
    const direct = (raw as { content?: unknown }).content;
    if (typeof direct === "string") {
      return direct.trim();
    }

    const nested = (raw as { choices?: Array<{ message?: { content?: unknown } }> }).choices?.[0]?.message?.content;
    if (typeof nested === "string") {
      return nested.trim();
    }
  }

  return "";
}
