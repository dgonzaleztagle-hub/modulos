export interface AdvisorInsight {
  type: "alert" | "info" | "success" | "opportunity";
  title: string;
  message: string;
  action?: string;
}

export interface AdvisorStats {
  tasaRetencion: number;
  totalReferidos: number;
  totalClientes: number;
  totalPremiosCanjeados: number;
}

export interface TopClient {
  nombre: string;
  totalPuntosHistoricos: number;
}

export function generateAdvisorInsights(stats: AdvisorStats, topClients: TopClient[]): AdvisorInsight[] {
  const insights: AdvisorInsight[] = [];

  if (stats.tasaRetencion < 40) {
    insights.push({
      type: "alert",
      title: "Alerta de Retención",
      message: "Tu tasa de retorno es baja (menor al 40%). Muchos clientes vienen una vez y no vuelven.",
      action: "Envía un mensaje de 'Te extrañamos' con un beneficio exclusivo.",
    });
  } else if (stats.tasaRetencion > 70) {
    insights.push({
      type: "success",
      title: "Fidelización Impecable",
      message: "Más del 70% de tus clientes son recurrentes. Tienes una comunidad muy sólida.",
      action: "Prueba subir el ticket promedio con un upgrade de premio.",
    });
  }

  if (stats.totalReferidos < 3) {
    insights.push({
      type: "opportunity",
      title: "Motor de Referidos Inactivo",
      message: "Casi no tienes nuevos clientes por recomendación.",
      action: "Ofrece 2 sellos de regalo a quien traiga un amigo.",
    });
  }

  if (topClients.length > 0 && topClients[0].totalPuntosHistoricos > 30) {
    insights.push({
      type: "opportunity",
      title: `Ocasión VIP: ${topClients[0].nombre}`,
      message: `${topClients[0].nombre} es tu cliente más fiel. Ha sumado ${topClients[0].totalPuntosHistoricos} puntos.`,
      action: "Envíale un regalo sorpresa vía WhatsApp para asegurar su recomendación.",
    });
  }

  if (stats.totalClientes > 50 && stats.totalPremiosCanjeados < 5) {
    insights.push({
      type: "info",
      title: "Barrera de Canje",
      message: "Tienes muchos clientes pero muy pocos están llegando al premio final.",
      action: "Prueba bajar la meta de puntos temporalmente para acelerar el beneficio.",
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: "info",
      title: "Analizando Datos...",
      message: "Sigue registrando visitas para obtener consejos más precisos.",
      action: "Registra al menos 10 clientes para ver el primer informe.",
    });
  }

  return insights;
}
