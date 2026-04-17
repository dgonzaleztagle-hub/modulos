export const PROGRAM_TYPE_VALUES = [
  "sellos",
  "cashback",
  "multipase",
  "membresia",
  "descuento",
  "cupon",
  "regalo",
  "afiliacion",
] as const;

export type ProgramType = (typeof PROGRAM_TYPE_VALUES)[number];
type UnknownRecord = Record<string, unknown>;

const LEGACY_TYPED_KEYS: Record<ProgramType, string[]> = {
  sellos: [],
  cashback: ["porcentaje", "tope_mensual"],
  multipase: ["cantidad_usos", "precio_pack"],
  membresia: ["duracion_dias", "beneficios", "precio_mensual"],
  descuento: ["niveles"],
  cupon: ["descuento_porcentaje", "valido_hasta"],
  regalo: ["valor_maximo"],
  afiliacion: [],
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asRecord(value: unknown): UnknownRecord {
  return isRecord(value) ? value : {};
}

function pickKeys(source: UnknownRecord, keys: string[]): UnknownRecord {
  const out: UnknownRecord = {};
  for (const key of keys) {
    if (source[key] !== undefined) out[key] = source[key];
  }
  return out;
}

export function isProgramType(value: unknown): value is ProgramType {
  return typeof value === "string" && PROGRAM_TYPE_VALUES.includes(value as ProgramType);
}

export function getProgramMotorConfig(rawConfig: unknown, type: ProgramType | string): UnknownRecord {
  const cfg = asRecord(rawConfig);
  const motors = asRecord(cfg.motors);
  const fromMotors = asRecord(motors[type]);
  if (Object.keys(fromMotors).length > 0) return fromMotors;
  return pickKeys(cfg, LEGACY_TYPED_KEYS[type as ProgramType] || []);
}

export function getAllProgramMotorConfigs(rawConfig: unknown): Record<string, UnknownRecord> {
  const cfg = asRecord(rawConfig);
  const motors = asRecord(cfg.motors);
  const output: Record<string, UnknownRecord> = {};

  for (const type of PROGRAM_TYPE_VALUES) {
    const fromMotors = asRecord(motors[type]);
    if (Object.keys(fromMotors).length > 0) {
      output[type] = fromMotors;
      continue;
    }
    const legacy = pickKeys(cfg, LEGACY_TYPED_KEYS[type]);
    if (Object.keys(legacy).length > 0) {
      output[type] = legacy;
    }
  }

  return output;
}

export function mergeProgramMotorConfig(rawConfig: unknown, byMotor: Record<string, UnknownRecord>) {
  const cfg = asRecord(rawConfig);
  const nextMotors: UnknownRecord = {};
  for (const [type, value] of Object.entries(byMotor)) {
    if (isRecord(value)) nextMotors[type] = value;
  }
  return { ...cfg, motors: nextMotors };
}
