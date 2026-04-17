export type ChecklistStatus = "cumple" | "no_cumple" | "no_aplica";

export interface ChecklistTemplateItem {
  id: string;
  text: string;
  category: string;
}

export interface ChecklistResultItem {
  itemId: string;
  text: string;
  category: string;
  status: ChecklistStatus;
  observation?: string;
}

export function buildChecklistResultsFromTemplate(items: ChecklistTemplateItem[]): ChecklistResultItem[] {
  return items.map((item) => ({
    itemId: item.id,
    text: item.text,
    category: item.category,
    status: "cumple",
    observation: "",
  }));
}

export function updateChecklistItemStatus(
  results: ChecklistResultItem[],
  itemId: string,
  status: ChecklistStatus,
) {
  return results.map((item) => (item.itemId === itemId ? { ...item, status } : item));
}

export function updateChecklistItemObservation(
  results: ChecklistResultItem[],
  itemId: string,
  observation: string,
) {
  return results.map((item) =>
    item.itemId === itemId ? { ...item, observation: observation.trim() } : item,
  );
}

export function groupChecklistResults(results: ChecklistResultItem[]) {
  return results.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, ChecklistResultItem[]>,
  );
}

export function summarizeChecklistResults(results: ChecklistResultItem[]) {
  return {
    cumple: results.filter((item) => item.status === "cumple").length,
    no_cumple: results.filter((item) => item.status === "no_cumple").length,
    no_aplica: results.filter((item) => item.status === "no_aplica").length,
  };
}

