export type CorrectiveMeasureSource = "accident" | "inspection";
export type CorrectiveMeasureStatus = "pendiente" | "en_proceso" | "completada";

export interface CorrectiveMeasureItem {
  id: string;
  description: string;
  deadline: string;
  source: CorrectiveMeasureSource;
  responsible?: string;
  status?: CorrectiveMeasureStatus;
}

export interface AccidentCorrectiveMeasureInput {
  id: string;
  description: string;
  deadline: string;
  responsible?: string;
  status?: CorrectiveMeasureStatus;
}

export interface InspectionCorrectiveMeasureInput {
  id: string;
  action: string;
  deadline: string;
  responsible?: string;
  status?: CorrectiveMeasureStatus;
}

export function fromAccidentMeasure(input: AccidentCorrectiveMeasureInput): CorrectiveMeasureItem {
  return {
    id: input.id,
    description: input.description,
    deadline: input.deadline,
    responsible: input.responsible,
    status: input.status || "pendiente",
    source: "accident",
  };
}

export function fromInspectionMeasure(input: InspectionCorrectiveMeasureInput): CorrectiveMeasureItem {
  return {
    id: input.id,
    description: input.action,
    deadline: input.deadline,
    responsible: input.responsible,
    status: input.status || "pendiente",
    source: "inspection",
  };
}

export function sortMeasuresByDeadline<T extends { deadline: string }>(measures: T[]) {
  return [...measures].sort(
    (left, right) => new Date(left.deadline).getTime() - new Date(right.deadline).getTime(),
  );
}

export function mergePendingMeasures(input: {
  accidents?: AccidentCorrectiveMeasureInput[];
  inspections?: InspectionCorrectiveMeasureInput[];
  limit?: number;
}) {
  const merged = [
    ...(input.accidents || []).map(fromAccidentMeasure).filter((item) => item.status !== "completada"),
    ...(input.inspections || []).map(fromInspectionMeasure).filter((item) => item.status !== "completada"),
  ];

  const sorted = sortMeasuresByDeadline(merged);
  return typeof input.limit === "number" ? sorted.slice(0, input.limit) : sorted;
}

export function summarizeCorrectiveMeasures(
  measures: CorrectiveMeasureItem[],
  now = new Date(),
) {
  let pending = 0;
  let inProgress = 0;
  let completed = 0;
  let overdue = 0;

  for (const measure of measures) {
    if (measure.status === "completada") {
      completed += 1;
      continue;
    }
    if (measure.status === "en_proceso") {
      inProgress += 1;
    } else {
      pending += 1;
    }
    if (new Date(measure.deadline).getTime() < now.getTime()) {
      overdue += 1;
    }
  }

  return { pending, inProgress, completed, overdue };
}

