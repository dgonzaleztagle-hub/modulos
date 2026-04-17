import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCatalogImagePath,
  inferCatalogCategory,
  parseProductTable,
  parseProductRow,
  validateProductData,
} from "../.dist/modulos/pos/product-importer/src/index.js";

test("product-importer parsea fila con aliases y stock", () => {
  const product = parseProductRow({
    Nombre: "Burger",
    Precio: "$12.990",
    "Control de Stock": "sí",
    Stock: "-4",
  });

  assert.equal(product?.name, "Burger");
  assert.equal(product?.price, 12.99);
  assert.equal(product?.stockQuantity, 0);
});

test("product-importer valida nombre y precio", () => {
  const result = validateProductData({
    name: "",
    price: 0,
    active: true,
    trackStock: false,
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.length >= 2);
});

test("product-importer infiere categoría y genera ruta de imagen por SKU", () => {
  assert.equal(inferCatalogCategory("Helado crazy chomp"), "helados");
  assert.equal(buildCatalogImagePath("12"), "/images/sku0012.jpg");
});

test("product-importer parsea tabla y completa categoría e imagen", () => {
  const result = parseProductTable(
    [
      {
        SKU: "7",
        Nombre: "Pizza margarita",
        Precio: "$9.990",
      },
      {
        Nombre: "",
        Precio: "$1.000",
      },
    ],
    {
      inferCategory: true,
      imageBasePath: "/catalogo",
    },
  );

  assert.equal(result.products.length, 1);
  assert.deepEqual(result.skippedRows, [1]);
  assert.equal(result.products[0].category, "pizzas");
  assert.equal(result.products[0].imagePath, "/catalogo/sku0007.jpg");
});
