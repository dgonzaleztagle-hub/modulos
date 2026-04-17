export interface FoodCompetitor {
  name: string;
  category: string;
  cuisines?: string[];
  address?: string;
}

export interface FoodSaturationBucket {
  count: number;
  level: "CRITICA" | "ALTA" | "MEDIA" | "BAJA" | "NULA";
  names: string[];
}

export interface FoodSaturationResult {
  total: number;
  byCategory: Record<string, FoodSaturationBucket>;
  oceanoAzul: string | null;
  oceanoRojo: string | null;
}

export const FOOD_CUISINE_KEYWORDS: Record<string, string[]> = {
  sushi: ["sushi", "japones", "japanese", "rolls", "temaki", "nigiri"],
  chinese: ["chino", "chinese", "cantones", "wok", "chifa"],
  korean: ["coreano", "korean", "kimchi", "bibimbap"],
  pizza: ["pizza", "pizzeria", "italiano", "pasta"],
  burger: ["burger", "hamburguesa", "americana", "american"],
  chicken: ["pollo", "chicken", "broaster", "frito", "wings"],
  mexican: ["mexicano", "mexican", "tacos", "burritos", "quesadilla"],
  peruvian: ["peruano", "peruvian", "ceviche", "lomo", "anticucho"],
  seafood: ["mariscos", "seafood", "pescado", "fish", "cevicheria"],
  healthy: ["saludable", "healthy", "ensaladas", "vegano", "vegan", "fit", "poke", "bowl"],
  cafe: ["cafe", "cafeteria", "coffee", "pasteleria"],
  fast_food: ["comida rapida", "fast food", "completos", "sandwich"],
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function classifyFoodCompetitor(name: string, category: string): string[] {
  const text = normalizeText(`${name} ${category}`);
  const matches = Object.entries(FOOD_CUISINE_KEYWORDS)
    .filter(([, keywords]) => keywords.some((keyword) => text.includes(normalizeText(keyword))))
    .map(([cuisine]) => cuisine);
  return matches.length > 0 ? matches : ["otros"];
}

export function getFoodSaturationLevel(count: number): FoodSaturationBucket["level"] {
  if (count > 10) return "CRITICA";
  if (count >= 5) return "ALTA";
  if (count >= 3) return "MEDIA";
  if (count >= 1) return "BAJA";
  return "NULA";
}

export function analyzeFoodSaturation(competitors: FoodCompetitor[]): FoodSaturationResult {
  const byCategory: Record<string, { count: number; names: string[] }> = {};

  for (const cuisine of Object.keys(FOOD_CUISINE_KEYWORDS)) {
    byCategory[cuisine] = { count: 0, names: [] };
  }
  byCategory.otros = { count: 0, names: [] };

  for (const competitor of competitors) {
    const cuisines =
      competitor.cuisines && competitor.cuisines.length > 0
        ? competitor.cuisines
        : classifyFoodCompetitor(competitor.name, competitor.category);
    for (const cuisine of cuisines) {
      if (!byCategory[cuisine]) byCategory[cuisine] = { count: 0, names: [] };
      byCategory[cuisine].count += 1;
      byCategory[cuisine].names.push(competitor.name);
    }
  }

  let oceanoAzul: string | null = null;
  let oceanoRojo: string | null = null;
  let minCount = Number.POSITIVE_INFINITY;
  let maxCount = -1;

  const result: Record<string, FoodSaturationBucket> = {};
  for (const [cuisine, value] of Object.entries(byCategory)) {
    if (cuisine === "otros") continue;
    result[cuisine] = {
      count: value.count,
      level: getFoodSaturationLevel(value.count),
      names: value.names,
    };
    if (value.count < minCount) {
      minCount = value.count;
      oceanoAzul = cuisine;
    }
    if (value.count > maxCount) {
      maxCount = value.count;
      oceanoRojo = cuisine;
    }
  }

  return {
    total: competitors.length,
    byCategory: result,
    oceanoAzul,
    oceanoRojo,
  };
}
