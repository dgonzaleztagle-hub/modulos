export interface EmploymentWorkerData {
  nombre: string;
  rut: string;
  nacionalidad?: string;
  estado_civil?: string;
  direccion?: string;
  ciudad?: string;
  cargo?: string;
  fecha_inicio?: string;
  tipo_plazo: string;
  fecha_termino?: string;
  tipo_jornada: string;
  funciones?: string;
  lugar_prestacion_funciones?: string;
  horario_laboral?: string;
  turnos_rotativos?: boolean;
  tipo_gratificacion?: string;
  clausulas_especiales?: string;
  afp?: string;
  salud?: string;
  banco?: string;
  tipo_cuenta?: string;
  numero_cuenta?: string;
  sueldo_base?: number;
}

export interface EmploymentClientData {
  razon_social: string;
  rut: string;
  direccion?: string;
  ciudad?: string;
  representante_legal?: string;
  rut_representante?: string;
}

export interface EmploymentContractOutline {
  title: string;
  sections: Array<{ title: string; lines: string[] }>;
}

export interface EmploymentContractAnnexData {
  worker: {
    nombre: string;
    rut: string;
    cargo: string;
    fecha_inicio: string;
    fecha_termino_original: string;
  };
  client: {
    razon_social: string;
    rut: string;
    representante_legal: string;
    rut_representante: string;
    ciudad: string;
  };
  modificacion: {
    tipo: "ampliacion" | "indefinido";
    meses_ampliacion: number;
    otras_modificaciones: string;
  };
}

function formatCurrentDate(): string {
  return new Date().toLocaleDateString("es-CL");
}

function formatContractTerm(worker: EmploymentWorkerData): string {
  if (worker.tipo_plazo === "fijo" && worker.fecha_termino) {
    return `EL TRABAJADOR prestará sus servicios a partir del ${worker.fecha_inicio || "___________"} y hasta el ${worker.fecha_termino}, siendo un contrato a plazo fijo.`;
  }
  return `EL TRABAJADOR prestará sus servicios a partir del ${worker.fecha_inicio || "___________"}, siendo un contrato a plazo indefinido.`;
}

function formatWorkingHours(worker: EmploymentWorkerData): string {
  const jornada =
    worker.tipo_jornada === "completa"
      ? "COMPLETA"
      : worker.tipo_jornada === "parcial_30"
        ? "PARCIAL de 30 horas semanales"
        : worker.tipo_jornada === "parcial_20"
          ? "PARCIAL de 20 horas semanales"
          : "___________";
  return `La jornada de trabajo será de tipo ${jornada}.`;
}

function formatSalary(worker: EmploymentWorkerData): string {
  const salary = worker.sueldo_base ? worker.sueldo_base.toLocaleString("es-CL") : "__________";
  return `Por los servicios convenidos, EL EMPLEADOR pagará a EL TRABAJADOR una remuneración mensual de $${salary}, pagadera dentro de los primeros 5 días hábiles de cada mes.`;
}

function formatGratification(worker: EmploymentWorkerData): string {
  if (worker.tipo_gratificacion === "art_47") {
    return "EL TRABAJADOR tendrá derecho a una gratificación anual equivalente al 30% de la utilidad líquida de la empresa, conforme al artículo 47 del Código del Trabajo.";
  }
  return "EL TRABAJADOR tendrá derecho a una gratificación equivalente al 25% de su remuneración mensual, conforme al artículo 50 del Código del Trabajo.";
}

export function buildEmploymentContractOutline(
  worker: EmploymentWorkerData,
  client: EmploymentClientData,
): EmploymentContractOutline {
  return {
    title: "Contrato de trabajo",
    sections: [
      {
        title: "Comparecencia",
        lines: [
          `En ${client.ciudad || "___________"}, a ${formatCurrentDate()}.`,
          `${client.razon_social}, RUT ${client.rut}, representada legalmente por ${client.representante_legal || "___________"}, RUT ${client.rut_representante || "___________"}, con domicilio en ${client.direccion || "___________"}, ${client.ciudad || "___________"}, en adelante "EL EMPLEADOR".`,
          `${worker.nombre}, ${worker.nacionalidad || "chileno(a)"}, ${worker.estado_civil || "___________"}, RUT ${worker.rut}, domiciliado(a) en ${worker.direccion || "___________"}, ${worker.ciudad || "___________"}, en adelante "EL TRABAJADOR".`,
        ],
      },
      {
        title: "Cargo y funciones",
        lines: [
          `EL TRABAJADOR se compromete a desempeñar el cargo de ${worker.cargo || "___________"}${worker.lugar_prestacion_funciones ? `, en ${worker.lugar_prestacion_funciones}` : ""}.`,
          ...(worker.funciones ? [worker.funciones] : []),
        ],
      },
      { title: "Vigencia", lines: [formatContractTerm(worker)] },
      {
        title: "Jornada",
        lines: [
          formatWorkingHours(worker),
          ...(worker.horario_laboral ? [`Horario de trabajo: ${worker.horario_laboral}.`] : []),
          ...(worker.turnos_rotativos ? ["El trabajador estará sujeto a turnos rotativos según las necesidades operativas de la empresa."] : []),
        ],
      },
      {
        title: "Remuneración y gratificación",
        lines: [formatSalary(worker), formatGratification(worker)],
      },
      {
        title: "Previsión y pago",
        lines: [
          `EL TRABAJADOR se encuentra afiliado a ${worker.afp || "___________"} para efectos de pensiones y a ${worker.salud || "___________"} para efectos de salud.`,
          `La remuneración se depositará en ${worker.banco || "___________"}, cuenta ${worker.tipo_cuenta || "___________"}, N° ${worker.numero_cuenta || "___________"}.`,
        ],
      },
      {
        title: "Obligaciones generales",
        lines: [
          "EL TRABAJADOR se obliga a cumplir fielmente las instrucciones de EL EMPLEADOR, el reglamento interno de la empresa, y las normas legales vigentes.",
          ...(worker.clausulas_especiales ? [worker.clausulas_especiales] : []),
          `Para todos los efectos legales del presente contrato, las partes fijan domicilio en la ciudad de ${client.ciudad || "___________"} y se someten a la jurisdicción de sus tribunales.`,
        ],
      },
    ],
  };
}

export function buildEmploymentContractAnnexOutline(data: EmploymentContractAnnexData): EmploymentContractOutline {
  const nuevaFechaTermino =
    data.modificacion.tipo === "ampliacion" && data.worker.fecha_termino_original
      ? (() => {
          const date = new Date(data.worker.fecha_termino_original);
          date.setMonth(date.getMonth() + data.modificacion.meses_ampliacion);
          return date.toLocaleDateString("es-CL");
        })()
      : null;

  return {
    title: "Anexo de contrato de trabajo",
    sections: [
      {
        title: "Comparecencia",
        lines: [
          `En ${data.client.ciudad || "___________"}, a ${formatCurrentDate()}.`,
          `${data.client.razon_social}, RUT ${data.client.rut}, representada legalmente por ${data.client.representante_legal}, RUT ${data.client.rut_representante}.`,
          `${data.worker.nombre}, RUT ${data.worker.rut}.`,
        ],
      },
      {
        title: "Referencia al contrato original",
        lines: [
          `Las partes ratifican el contrato de trabajo suscrito con fecha ${data.worker.fecha_inicio || "___________"}, para el cargo de ${data.worker.cargo || "___________"}.`,
        ],
      },
      {
        title: "Modificación principal",
        lines: [
          data.modificacion.tipo === "ampliacion"
            ? `Se modifica la cláusula de plazo del contrato, extendiéndose por un período de ${data.modificacion.meses_ampliacion} meses adicionales. La nueva fecha de término será el ${nuevaFechaTermino}.`
            : "Se modifica la cláusula de plazo del contrato, cambiando de plazo fijo a plazo indefinido.",
          ...(data.modificacion.otras_modificaciones ? [data.modificacion.otras_modificaciones] : []),
        ],
      },
      {
        title: "Vigencia del anexo",
        lines: [
          "Todas las demás cláusulas del contrato original que no hayan sido expresamente modificadas mantienen plena vigencia y efecto.",
          "El presente anexo forma parte integrante del contrato de trabajo y entra en vigencia a partir de su suscripción.",
        ],
      },
    ],
  };
}
