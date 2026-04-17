export const REGIONES_CHILE = [
  { code: "XV", name: "Arica y Parinacota" },
  { code: "I", name: "Tarapacá" },
  { code: "II", name: "Antofagasta" },
  { code: "III", name: "Atacama" },
  { code: "IV", name: "Coquimbo" },
  { code: "V", name: "Valparaíso" },
  { code: "RM", name: "Metropolitana de Santiago" },
  { code: "VI", name: "O'Higgins" },
  { code: "VII", name: "Maule" },
  { code: "XVI", name: "Ñuble" },
  { code: "VIII", name: "Biobío" },
  { code: "IX", name: "La Araucanía" },
  { code: "XIV", name: "Los Ríos" },
  { code: "X", name: "Los Lagos" },
  { code: "XI", name: "Aysén" },
  { code: "XII", name: "Magallanes" },
] as const;

export function cleanRut(rut: string): string {
  return String(rut || "").replace(/[.-]/g, "").toUpperCase();
}

export function calculateRutDV(rut: string): string {
  const body = cleanRut(rut).slice(0, -1);
  if (!/^\d+$/.test(body)) return "";

  let sum = 0;
  let multiplier = 2;

  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += parseInt(body[index], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = sum % 11;
  const dv = 11 - remainder;
  if (dv === 11) return "0";
  if (dv === 10) return "K";
  return String(dv);
}

export function validateRut(rut: string): boolean {
  const cleaned = cleanRut(rut);
  if (cleaned.length < 2) return false;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  if (!/^\d+$/.test(body)) return false;
  if (!/^[0-9K]$/.test(dv)) return false;
  return calculateRutDV(`${body}${dv}`) === dv;
}

export function formatRut(rut: string, options?: { dotted?: boolean }) {
  const cleaned = cleanRut(rut);
  if (cleaned.length < 2) return cleaned;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  const formattedBody = options?.dotted === false
    ? body
    : body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formattedBody}-${dv}`;
}

export function getRutNumber(rut: string) {
  return cleanRut(rut).slice(0, -1);
}

export function getRutDV(rut: string) {
  return cleanRut(rut).slice(-1);
}

export function parseUfValue(rawValue: string) {
  const parsed = parseFloat(String(rawValue).replace(/\./g, "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

export function clpToUf(clp: number, ufValue: number) {
  return ufValue > 0 ? clp / ufValue : 0;
}

export function ufToClp(uf: number, ufValue: number) {
  return uf * ufValue;
}

export function formatCLP(amount: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUF(amount: number) {
  return `UF ${new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

export function formatUFWithCLP(uf: number, ufValue: number) {
  return `${formatUF(uf)} (${formatCLP(Math.round(ufToClp(uf, ufValue)))})`;
}
