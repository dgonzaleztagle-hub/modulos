export interface WorkerPaymentStatus {
  nombre: string;
  rut: string;
  pagado: boolean;
  fechaPago?: string | null;
  monto: number;
}

export interface SocialSecurityReportData {
  clientRazonSocial: string;
  clientRut: string;
  periodoMes: number;
  periodoAnio: number;
  estado: string;
  monto?: number;
  fechaDeclaracion?: string | null;
  fechaPago?: string | null;
  workers: WorkerPaymentStatus[];
}

export interface SocialSecurityCompanySummary {
  clientRazonSocial: string;
  clientRut: string;
  estado: string;
  monto?: number;
  totalWorkers: number;
  paidWorkers: number;
}

export interface SocialSecurityReportOutline {
  title: string;
  periodLabel: string;
  summary: {
    totalWorkers: number;
    paidWorkers: number;
    pendingWorkers: number;
    totalAmount: number;
    declarationDate: string;
    paymentDate: string;
  };
  workerRows: Array<{
    nombre: string;
    rut: string;
    estado: "pagado" | "pendiente";
    fechaPago: string;
    monto: number;
  }>;
}

export interface SocialSecurityPortfolioOutline {
  title: string;
  periodLabel: string;
  summary: {
    totalCompanies: number;
    paidCompanies: number;
    pendingCompanies: number;
    totalWorkers: number;
    paidWorkers: number;
  };
  companyRows: Array<{
    clientRazonSocial: string;
    totalWorkers: number;
    paidWorkers: number;
    estado: string;
  }>;
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

function formatLocalDate(date: string | null | undefined): string {
  if (!date) return "-";
  const [year, month, day] = date.split("-").map(Number);
  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
}

export function buildSocialSecurityReportOutline(
  data: SocialSecurityReportData,
): SocialSecurityReportOutline {
  const totalWorkers = data.workers.length;
  const paidWorkers = data.workers.filter((worker) => worker.pagado).length;
  const pendingWorkers = totalWorkers - paidWorkers;
  const totalAmount = data.workers.reduce((sum, worker) => sum + (worker.monto || 0), 0);

  return {
    title: "Informe de cotizaciones previsionales",
    periodLabel: `${MONTHS[data.periodoMes - 1]} ${data.periodoAnio}`,
    summary: {
      totalWorkers,
      paidWorkers,
      pendingWorkers,
      totalAmount,
      declarationDate: formatLocalDate(data.fechaDeclaracion),
      paymentDate: formatLocalDate(data.fechaPago),
    },
    workerRows: data.workers.map((worker) => ({
      nombre: worker.nombre,
      rut: worker.rut,
      estado: worker.pagado ? "pagado" : "pendiente",
      fechaPago: formatLocalDate(worker.fechaPago),
      monto: worker.monto,
    })),
  };
}

export function buildSocialSecurityPortfolioOutline(
  companies: SocialSecurityCompanySummary[],
  filterInfo: { mes: number; anio: number },
): SocialSecurityPortfolioOutline {
  const totalCompanies = companies.length;
  const paidCompanies = companies.filter((company) => company.estado === "pagada").length;
  const pendingCompanies = totalCompanies - paidCompanies;
  const totalWorkers = companies.reduce((sum, company) => sum + company.totalWorkers, 0);
  const paidWorkers = companies.reduce((sum, company) => sum + company.paidWorkers, 0);

  return {
    title: "Informe general de cotizaciones previsionales",
    periodLabel: `${MONTHS[filterInfo.mes - 1]} ${filterInfo.anio}`,
    summary: {
      totalCompanies,
      paidCompanies,
      pendingCompanies,
      totalWorkers,
      paidWorkers,
    },
    companyRows: companies.map((company) => ({
      clientRazonSocial: company.clientRazonSocial,
      totalWorkers: company.totalWorkers,
      paidWorkers: company.paidWorkers,
      estado: company.estado,
    })),
  };
}
