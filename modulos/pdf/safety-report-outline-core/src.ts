export interface SafetyOutlineSection {
  title: string;
  subtitle?: string;
  lines: string[];
}

export interface SafetyCorrectiveMeasure {
  description?: string;
  action?: string;
  responsible: string;
  deadline: string;
  status: "pendiente" | "en_proceso" | "completada";
}

export interface AccidentReportInput {
  worker_name: string;
  worker_rut: string;
  worker_position: string;
  accident_date: string;
  accident_time: string;
  accident_location: string;
  accident_type: "trabajo" | "trayecto";
  description: string;
  injury_type: string;
  sick_leave_days: number;
  why1?: string;
  why2?: string;
  why3?: string;
  why4?: string;
  why5?: string;
  root_cause?: string;
}

export interface InspectionReportInput {
  inspection_date: string;
  area: string;
  inspector: string;
  inspection_type: "programada" | "no_programada";
}

export interface InspectionFinding {
  description: string;
  severity: "critico" | "mayor" | "menor";
  location: string;
}

export interface TrainingReportInput {
  title: string;
  training_date: string;
  duration_minutes: number;
  instructor: string;
  topic: string;
  objectives: string | null;
  observations: string | null;
}

export interface TrainingAttendee {
  name: string;
  rut: string;
  attended: boolean;
}

const STATUS_LABELS: Record<SafetyCorrectiveMeasure["status"], string> = {
  pendiente: "Pendiente",
  en_proceso: "En Proceso",
  completada: "Completada",
};

const SEVERITY_LABELS: Record<InspectionFinding["severity"], string> = {
  critico: "Critico",
  mayor: "Mayor",
  menor: "Menor",
};

export function buildAccidentReportOutline(
  accident: AccidentReportInput,
  measures: SafetyCorrectiveMeasure[],
): SafetyOutlineSection[] {
  const sections: SafetyOutlineSection[] = [
    {
      title: "Datos del trabajador",
      lines: [
        `Nombre: ${accident.worker_name}`,
        `RUT: ${accident.worker_rut}`,
        `Cargo: ${accident.worker_position}`,
      ],
    },
    {
      title: "Datos del accidente",
      lines: [
        `Fecha: ${accident.accident_date}`,
        `Hora: ${accident.accident_time}`,
        `Lugar: ${accident.accident_location}`,
        `Tipo: ${accident.accident_type === "trabajo" ? "Accidente de trabajo" : "Accidente de trayecto"}`,
        `Lesion: ${accident.injury_type}`,
        `Licencia: ${accident.sick_leave_days} dias`,
      ],
    },
    {
      title: "Descripcion del incidente",
      lines: [accident.description],
    },
  ];

  const whys = [accident.why1, accident.why2, accident.why3, accident.why4, accident.why5].filter(Boolean) as string[];
  if (whys.length > 0 || accident.root_cause) {
    sections.push({
      title: "Analisis 5 por ques",
      lines: [
        ...whys.map((line, index) => `Por que ${index + 1}: ${line}`),
        ...(accident.root_cause ? [`Causa raiz: ${accident.root_cause}`] : []),
      ],
    });
  }

  if (measures.length > 0) {
    sections.push({
      title: "Medidas correctivas",
      lines: measures.map(
        (measure) =>
          `${measure.description || measure.action || "Medida"} | Responsable: ${measure.responsible} | Plazo: ${measure.deadline} | Estado: ${STATUS_LABELS[measure.status]}`,
      ),
    });
  }

  return sections;
}

export function buildInspectionReportOutline(
  inspection: InspectionReportInput,
  findings: InspectionFinding[],
  measures: SafetyCorrectiveMeasure[],
): SafetyOutlineSection[] {
  const sections: SafetyOutlineSection[] = [
    {
      title: "Informacion general",
      lines: [
        `Fecha: ${inspection.inspection_date}`,
        `Area: ${inspection.area}`,
        `Inspector: ${inspection.inspector}`,
        `Tipo: ${inspection.inspection_type === "programada" ? "Programada" : "No programada"}`,
      ],
    },
  ];

  if (findings.length > 0) {
    sections.push({
      title: "Hallazgos",
      lines: findings.map(
        (finding) => `${finding.description} | Severidad: ${SEVERITY_LABELS[finding.severity]} | Ubicacion: ${finding.location}`,
      ),
    });
  }

  if (measures.length > 0) {
    sections.push({
      title: "Medidas correctivas",
      lines: measures.map(
        (measure) =>
          `${measure.description || measure.action || "Accion"} | Responsable: ${measure.responsible} | Plazo: ${measure.deadline} | Estado: ${STATUS_LABELS[measure.status]}`,
      ),
    });
  }

  if (findings.length > 0) {
    const summary = findings.reduce(
      (acc, finding) => {
        acc[finding.severity] += 1;
        return acc;
      },
      { critico: 0, mayor: 0, menor: 0 },
    );

    sections.push({
      title: "Resumen",
      lines: [
        `Criticos: ${summary.critico}`,
        `Mayores: ${summary.mayor}`,
        `Menores: ${summary.menor}`,
        `Total: ${findings.length}`,
      ],
    });
  }

  return sections;
}

export function buildTrainingReportOutline(
  training: TrainingReportInput,
  attendees: TrainingAttendee[],
): SafetyOutlineSection[] {
  const sections: SafetyOutlineSection[] = [
    {
      title: "Informacion de la capacitacion",
      lines: [
        `Titulo: ${training.title}`,
        `Tema: ${training.topic}`,
        `Relator: ${training.instructor}`,
        `Fecha: ${training.training_date}`,
        `Duracion: ${training.duration_minutes} minutos`,
      ],
    },
  ];

  if (training.objectives) {
    sections.push({
      title: "Objetivos",
      lines: [training.objectives],
    });
  }

  if (training.observations) {
    sections.push({
      title: "Observaciones",
      lines: [training.observations],
    });
  }

  if (attendees.length > 0) {
    sections.push({
      title: "Lista de asistencia",
      lines: attendees.map(
        (attendee, index) =>
          `${index + 1}. ${attendee.name} | ${attendee.rut} | ${attendee.attended ? "Asistio" : "Ausente"}`,
      ),
    });

    const attendedCount = attendees.filter((attendee) => attendee.attended).length;
    sections.push({
      title: "Resumen",
      lines: [
        `Inscritos: ${attendees.length}`,
        `Asistentes: ${attendedCount}`,
        `Ausentes: ${attendees.length - attendedCount}`,
      ],
    });
  }

  return sections;
}
