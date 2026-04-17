export interface ParsedProduct {
  sku?: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  category?: string;
  active: boolean;
  trackStock: boolean;
  stockQuantity?: number;
  imagePath?: string;
  metadata?: Record<string, unknown>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ProductImportColumnMap {
  sku?: string[];
  name?: string[];
  description?: string[];
  price?: string[];
  wholesalePrice?: string[];
  wholesaleThreshold?: string[];
  cost?: string[];
  category?: string[];
  image?: string[];
  favorite?: string[];
  superFavorite?: string[];
  active?: string[];
  trackStock?: string[];
  stockQuantity?: string[];
}

const defaultColumnMap: Required<ProductImportColumnMap> = {
  sku: ["SKU", "sku", "Sku", "codigo", "Código", "codigo producto"],
  name: ["Nombre", "nombre", "NOMBRE", "name", "Name"],
  description: ["Descripción", "descripcion", "Descripcion", "DESCRIPCION", "description"],
  price: ["Precio", "precio", "PRECIO", "price", "Price"],
  wholesalePrice: ["Precio Mayor", "precio mayor", "precio mayorista", "mayor"],
  wholesaleThreshold: ["Precio Mayor Desde", "precio mayor desde", "umbral mayorista"],
  cost: ["Costo", "costo", "COSTO", "cost", "Cost"],
  category: ["Categoría", "categoria", "Categoria", "CATEGORIA", "category", "Category"],
  image: ["IMAGEN", "imagen", "Imagen", "image", "Image"],
  favorite: ["Favorito", "favorito", "FAVORITO", "featured"],
  superFavorite: ["Superfavorito", "superfavorito", "SUPERFAVORITO"],
  active: ["Activo", "activo", "ACTIVO", "active", "Active"],
  trackStock: ["Control de Stock", "control_stock", "track_stock", "Track Stock"],
  stockQuantity: ["Stock", "stock", "STOCK", "stock_quantity"],
};

export interface ProductImportTableOptions {
  columnMap?: ProductImportColumnMap;
  defaultActive?: boolean;
  defaultTrackStock?: boolean;
  inferCategory?: boolean;
  imageBasePath?: string;
  imageExtension?: string;
}

export interface ProductImportResult {
  products: ParsedProduct[];
  skippedRows: number[];
}

export function parseProductRow(
  row: Record<string, unknown>,
  columnMap: ProductImportColumnMap = {},
): ParsedProduct | null {
  const columns = { ...defaultColumnMap, ...columnMap };
  const sku = getRowValue(row, columns.sku);
  const name = getRowValue(row, columns.name);
  const description = getRowValue(row, columns.description);
  const price = parseNumber(getRowValue(row, columns.price));
  const cost = parseNumber(getRowValue(row, columns.cost));
  const category = getRowValue(row, columns.category);
  const wholesalePrice = parseNumber(getRowValue(row, columns.wholesalePrice));
  const wholesaleThreshold = getRowValue(row, columns.wholesaleThreshold);
  const image = getRowValue(row, columns.image);
  const favorite = parseBoolean(getRowValue(row, columns.favorite), false);
  const superFavorite = parseBoolean(getRowValue(row, columns.superFavorite), false);
  const active = parseBoolean(getRowValue(row, columns.active), true);
  const trackStock = parseBoolean(getRowValue(row, columns.trackStock), false);
  const stockQuantityRaw = parseNumber(getRowValue(row, columns.stockQuantity));

  if (!name || price === null) {
    return null;
  }

  const stockQuantity = stockQuantityRaw !== null && stockQuantityRaw < 0 ? 0 : stockQuantityRaw;

  return {
    sku: sku ? normalizeSku(sku) : undefined,
    name: name.trim(),
    description: description?.trim() || undefined,
    price,
    cost: cost ?? undefined,
    category: category?.trim() || undefined,
    active,
    trackStock,
    stockQuantity: trackStock ? stockQuantity ?? 0 : undefined,
    imagePath: image?.trim() || undefined,
    metadata: {
      wholesalePrice: wholesalePrice ?? undefined,
      wholesaleThreshold: wholesaleThreshold?.trim() || undefined,
      favorite,
      superFavorite,
    },
  };
}

export function parseProductTable(
  rows: Array<Record<string, unknown>>,
  options: ProductImportTableOptions = {},
): ProductImportResult {
  const products: ParsedProduct[] = [];
  const skippedRows: number[] = [];

  rows.forEach((row, index) => {
    const parsed = parseProductRow(row, options.columnMap);
    if (!parsed) {
      skippedRows.push(index);
      return;
    }

    const withDefaults: ParsedProduct = {
      ...parsed,
      active: parsed.active ?? options.defaultActive ?? true,
      trackStock: parsed.trackStock ?? options.defaultTrackStock ?? false,
    };

    const withCategory =
      options.inferCategory && !withDefaults.category
        ? { ...withDefaults, category: inferCatalogCategory(withDefaults.name) }
        : withDefaults;

    const withImage =
      options.imageBasePath && withCategory.sku
        ? {
            ...withCategory,
            imagePath:
              withCategory.imagePath ||
              buildCatalogImagePath(withCategory.sku, options.imageBasePath, options.imageExtension),
          }
        : withCategory;

    products.push(withImage);
  });

  return { products, skippedRows };
}

export function validateProductData(product: ParsedProduct): ValidationResult {
  const errors: string[] = [];

  if (!product.name.trim()) errors.push("El nombre es requerido");
  if (product.name.length > 200) errors.push("El nombre es muy largo (máx 200 caracteres)");
  if (product.price <= 0) errors.push("El precio debe ser mayor a 0");
  if (product.cost !== undefined && product.cost < 0) errors.push("El costo no puede ser negativo");
  if (product.trackStock && product.stockQuantity !== undefined && product.stockQuantity < 0) {
    errors.push("El stock no puede ser negativo");
  }

  return { valid: errors.length === 0, errors };
}

export function normalizeSku(value: string | number): string {
  const raw = String(value).trim();
  const digits = raw.replace(/\D/g, "");
  if (!digits) return raw.toUpperCase();
  return digits.padStart(4, "0");
}

export function buildCatalogImagePath(
  sku: string | number,
  basePath = "/images",
  extension = ".jpg",
): string {
  const normalizedExtension = extension.startsWith(".") ? extension : `.${extension}`;
  return `${basePath}/sku${normalizeSku(sku)}${normalizedExtension}`;
}

export function inferCatalogCategory(productName: string): string {
  const name = productName.toLowerCase();

  if (matchesAny(name, ["soya", "garbanzo", "poroto negro"])) return "vegano";
  if (matchesAny(name, ["churrasco", "lomito", "carne molida", "carne picada", "albóndiga", "albondiga", "hamburguesa", "hambuerguesa", "surtido"])) return "vacuno";
  if (matchesAny(name, ["chuleta", "cerdo", "salchicha"])) return "cerdo";
  if (matchesAny(name, ["pollo", "cubito", "alitas", "suprema"])) return "pollo";
  if (matchesAny(name, ["camarón", "camaron", "mariscos", "pescado"])) return "mariscos";
  if (matchesAny(name, ["papas", "frita", "papa duquesa"])) return "papas";
  if (matchesAny(name, ["helado", "palito", "cassata", "chomp", "crazy", "danky", "daknky", "kriko", "mega", "mustang", "savory", "trululu", "paleta", "cremino", "paleton", "brazuka", "splash"])) return "helados";
  if (matchesAny(name, ["pizza"])) return "pizzas";
  if (matchesAny(name, ["fruta", "frutilla", "maracuyá", "maracuya", "arándano", "arandano", "durazno", "mango", "piña", "frutos del bosque", "pulpa"])) return "frutas";
  if (matchesAny(name, ["verdura", "arvejas", "arveja", "choclo", "edamame", "ajo", "cebolla", "champi", "zanahoria", "esparrago", "habas", "mix de pimentones", "poroto verde", "primavera", "sofrito", "tortilla", "zapallo"])) return "verduras";

  return "otros";
}

function getRowValue(row: Record<string, unknown>, possibleKeys: string[]): string {
  for (const key of possibleKeys) {
    const value = row[key];
    if (value !== undefined && value !== null && value !== "") {
      return String(value);
    }
  }
  return "";
}

function parseNumber(value: string | number): number | null {
  if (value === "" || value === null || value === undefined) return null;
  const num = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isNaN(num) ? null : num;
}

function parseBoolean(value: string | number | boolean, defaultValue = false): boolean {
  if (value === "" || value === null || value === undefined) return defaultValue;
  const normalized = String(value).toLowerCase().trim();
  if (["si", "sí", "yes", "y", "1", "true"].includes(normalized)) return true;
  if (["no", "0", "false"].includes(normalized)) return false;
  return defaultValue;
}

function matchesAny(value: string, candidates: string[]): boolean {
  return candidates.some((candidate) => value.includes(candidate));
}
