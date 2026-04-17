export interface TerritorialQueryBundle {
  useSerperScraper: boolean;
  specificQueries: string[];
}

export interface TerritorialSynthesisInput {
  businessType: string;
  comuna: string;
  address: string;
}

export interface TerritorialDataBlock {
  saturation: unknown;
  oceanoAzul: string | null;
  oceanoRojo: string | null;
  restaurants?: unknown[];
  anchors?: unknown[];
}

const BUSINESS_QUERIES: Record<string, (comuna: string, address: string) => string[]> = {
  restaurant: (comuna, address) => [
    `sushi en ${comuna}, Chile`,
    `hamburguesas en ${comuna}, Chile`,
    `restaurantes cerca de ${address}`,
  ],
  fast_food: (comuna, address) => [
    `comida rápida en ${comuna}, Chile`,
    `hamburguesas en ${comuna}, Chile`,
    `fast food cerca de ${address}`,
  ],
  cafe: (comuna) => [
    `cafeterías en ${comuna}, Chile`,
    `coffee shop en ${comuna}, Chile`,
  ],
  pharmacy: (comuna) => [
    `farmacias en ${comuna}, Chile`,
    `Cruz Verde en ${comuna}, Chile`,
  ],
};

export function getTerritorialQueries(input: TerritorialSynthesisInput): TerritorialQueryBundle {
  const builder = BUSINESS_QUERIES[input.businessType];
  if (!builder) return { useSerperScraper: false, specificQueries: [] };

  return {
    useSerperScraper: true,
    specificQueries: builder(input.comuna, input.address),
  };
}

export function buildTerritorialSummary(data: TerritorialDataBlock) {
  return {
    saturation: data.saturation,
    oceanoAzul: data.oceanoAzul,
    oceanoRojo: data.oceanoRojo,
    restaurantCount: data.restaurants?.length ?? 0,
    anchorCount: data.anchors?.length ?? 0,
  };
}
