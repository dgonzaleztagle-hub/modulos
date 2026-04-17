export interface HonorariosAccountData {
  clientRazonSocial: string;
  clientRut: string;
  clientDireccion?: string;
  clientEmail?: string;
  periodoMes: number;
  periodoAnio: number;
  montoPeriodo: number;
  saldoPendienteAnterior: number;
  totalConSaldo?: number;
  estado: string;
  fechaEmision: string;
}

export interface HonorariosBranding {
  appName?: string;
  contactEmail?: string | null;
}

export interface HonorariosAccountOutline {
  title: string;
  periodLabel: string;
  totals: {
    montoPeriodo: number;
    saldoPendienteAnterior: number;
    totalConSaldo: number;
  };
  statusLabel: string;
  sections: Array<{ title: string; lines: string[] }>;
}

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function mapStatusLabel(status: string): string {
  switch (status) {
    case "pagado":
      return "PAGADO";
    case "parcial":
      return "PAGO PARCIAL";
    default:
      return "PENDIENTE DE PAGO";
  }
}

export function buildHonorariosAccountOutline(
  data: HonorariosAccountData,
  branding?: HonorariosBranding,
): HonorariosAccountOutline {
  const totalConSaldo = data.totalConSaldo ?? data.montoPeriodo + data.saldoPendienteAnterior;
  const periodLabel = `${MONTHS[data.periodoMes - 1]} ${data.periodoAnio}`;

  return {
    title: "Estado de cuenta",
    periodLabel,
    totals: {
      montoPeriodo: data.montoPeriodo,
      saldoPendienteAnterior: data.saldoPendienteAnterior,
      totalConSaldo,
    },
    statusLabel: mapStatusLabel(data.estado),
    sections: [
      {
        title: "Cliente",
        lines: [
          data.clientRazonSocial,
          `RUT: ${data.clientRut}`,
          ...(data.clientDireccion ? [`Dirección: ${data.clientDireccion}`] : []),
          ...(data.clientEmail ? [`Email: ${data.clientEmail}`] : []),
        ],
      },
      {
        title: "Detalle de honorarios",
        lines: [
          `Honorarios del período: $${data.montoPeriodo.toLocaleString("es-CL")}`,
          `Saldo pendiente anterior: $${data.saldoPendienteAnterior.toLocaleString("es-CL")}`,
          `Total a pagar: $${totalConSaldo.toLocaleString("es-CL")}`,
        ],
      },
      {
        title: "Cobranza",
        lines: [
          `Estado actual: ${mapStatusLabel(data.estado)}`,
          `Fecha de emisión: ${data.fechaEmision}`,
          ...(branding?.appName ? [`Emitido por ${branding.appName}`] : []),
          ...(branding?.contactEmail ? [`Enviar comprobante a ${branding.contactEmail}`] : []),
        ],
      },
    ],
  };
}
