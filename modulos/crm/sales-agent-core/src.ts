export interface AuditResults {
  score: number;
  ttfb: { value: string; abandonmentRate: string };
  security: { ssl: string; serverHeader: string };
  tech: { builder: string; isSlow: boolean; stack: string[] };
  competitor: { name: string; location: string; status: string };
  mobile: { score: number; status: string };
}

export type SentimentProfile = "TECHNICAL" | "BUSINESS" | "UNKNOWN";
export type MainPain = "VELOCITY" | "SECURITY" | "COMPETITION";
export type ProjectComplexity = "STANDARD" | "COMPLEX";

export class SalesAgentBrain {
  private audit: AuditResults;
  private profile: SentimentProfile = "UNKNOWN";
  private primaryPain: MainPain = "VELOCITY";
  private complexity: ProjectComplexity = "STANDARD";
  private hasShownDesire = false;
  private isEliteSite = false;

  constructor(audit: AuditResults) {
    this.audit = audit;
    this.isEliteSite = audit.score >= 95 && parseInt(audit.ttfb.value, 10) < 200;
    this.identifyPrimaryPain();
    this.evaluateComplexity();
  }

  private identifyPrimaryPain() {
    if (parseInt(this.audit.ttfb.value, 10) > 1000 || parseFloat(this.audit.ttfb.abandonmentRate) > 20) {
      this.primaryPain = "VELOCITY";
    } else if (this.audit.security.ssl !== "Válido") {
      this.primaryPain = "SECURITY";
    } else {
      this.primaryPain = "COMPETITION";
    }
  }

  private evaluateComplexity() {
    const stackStr = this.audit.tech.stack.join(" ").toLowerCase();
    const isEcommerce = stackStr.includes("shopify") || stackStr.includes("woo") || stackStr.includes("e-commerce") || stackStr.includes("tienda");
    const isComplexStack = stackStr.includes("laravel") || stackStr.includes("node") || stackStr.includes("django") || stackStr.includes("pluscontable");
    this.complexity = isEcommerce || isComplexStack || this.audit.score < 40 ? "COMPLEX" : "STANDARD";
  }

  public setProfile(userInput: string) {
    const text = userInput.toLowerCase();
    const techKeywords = ["ttfb", "servidor", "ssl", "stack", "php", "wordpress", "javascript", "backend", "api", "load"];
    const bizKeywords = ["venta", "dinero", "clientes", "precio", "barato", "caro", "perdiendo", "negocio", "competencia", "ganar"];
    const techCount = techKeywords.filter((keyword) => text.includes(keyword)).length;
    const bizCount = bizKeywords.filter((keyword) => text.includes(keyword)).length;
    if (techCount > bizCount) this.profile = "TECHNICAL";
    else if (bizCount > techCount) this.profile = "BUSINESS";
  }

  public getDesirePitch() {
    this.hasShownDesire = true;
    const contrast = this.audit.tech.isSlow
      ? `Mientras tu infraestructura actual corre sobre ${this.audit.tech.builder}, H0 despliega sobre arquitectura Headless.`
      : `Tu base técnica es aceptable, pero carece de la velocidad de escape necesaria para dominar en ${this.audit.competitor.location}.`;
    return `${contrast} Nosotros no solo hacemos webs; construimos activos de ingeniería que cargan en milisegundos.`;
  }

  public handleObjection(objectionType: "BUDGET" | "TRUST" | "TIME") {
    const painRef = this.primaryPain === "VELOCITY"
      ? `seguir perdiendo un ${this.audit.ttfb.abandonmentRate} de ventas por lentitud`
      : this.primaryPain === "SECURITY"
        ? "exponer la integridad de tu negocio con un servidor vulnerable"
        : `dejar que ${this.audit.competitor.name} se quede con todo el tráfico de la zona`;

    switch (objectionType) {
      case "BUDGET":
        return this.complexity === "STANDARD"
          ? `El Upgrade H0 es de $145.000 CLP. Comparado con el costo de ${painRef}, se paga solo en el primer mes.`
          : `El costo de ${painRef} es constante. En proyectos de tu escala, la inversión se justifica por ROI directo.`;
      case "TRUST":
        return "No somos una agencia de diseño; somos socios de infraestructura. La ingeniería H0 escala donde otras fallan.";
      case "TIME":
        return `Entiendo el factor tiempo. Si el objetivo es detener tu ${this.primaryPain.toLowerCase()}, hoy es el momento táctico.`;
      default:
        return "Es una duda razonable. Analicemos cómo solucionamos el punto crítico detectado.";
    }
  }

  public generateResponse(userInput: string): { content: string; showAgenda?: boolean; showCheckout?: boolean; price?: string } {
    this.setProfile(userInput);
    const text = userInput.toLowerCase();

    if (this.isEliteSite && (text.includes("como") || text.includes("precio") || text.includes("ayuda"))) {
      return {
        content: "Tu sitio ya está en nivel élite. No sería ético venderte un upgrade estándar; aquí conviene una sesión estratégica de escalado.",
        showAgenda: true,
      };
    }

    if (text.includes("caro") || text.includes("presupuesto") || text.includes("precio") || text.includes("cuanto")) {
      return { content: this.handleObjection("BUDGET") };
    }
    if (text.includes("confianza") || text.includes("quienes") || text.includes("seguro") || text.includes("garantia")) {
      return { content: this.handleObjection("TRUST") };
    }
    if (text.includes("despues") || text.includes("luego") || text.includes("mañana") || text.includes("pensar")) {
      return { content: this.handleObjection("TIME") };
    }

    if (text.includes("como") && (text.includes("arreglo") || text.includes("solucion") || text.includes("hacer") || text.includes("ayud") || text.includes("precio"))) {
      if (this.complexity === "STANDARD") {
        return {
          content: "Para solucionarlo rápido, preparé el Upgrade de Rendimiento H0 por $145.000 CLP.",
          showCheckout: true,
          price: "$145.000",
        };
      }
      return {
        content: this.profile === "TECHNICAL"
          ? "Tu proyecto requiere una sesión de arquitectura profunda. Lo correcto es agenda directa con un especialista."
          : "Un negocio de tu escala no puede usar soluciones estándar. Lo correcto es una sesión estratégica a medida.",
        showAgenda: true,
      };
    }

    if (!this.hasShownDesire && text.length > 2) {
      return { content: this.getDesirePitch() };
    }

    if (this.profile === "TECHNICAL") {
      return {
        content: `Analizando tu stack (${this.audit.tech.stack.join("/")}), vemos que el cuello de botella está en ${this.audit.security.serverHeader}.`,
      };
    }

    return {
      content: `En este momento le estás regalando clientes a ${this.audit.competitor.name}. ¿Te explico cómo recuperamos ese terreno?`,
    };
  }
}

export const SALES_AGENT_SYSTEM_PROMPT = `
Eres H0, asesor comercial técnico. Hablas humano, pides contacto temprano, diagnosticas una URL si el usuario la comparte y nunca prometes agendamiento si la herramienta no lo confirma.
`;

export const SALES_TOOLS = [
  "diagnose_website",
  "save_lead",
  "check_availability",
  "book_meeting",
  "escalate_to_human",
] as const;
