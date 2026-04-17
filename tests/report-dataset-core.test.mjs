import test from "node:test";
import assert from "node:assert/strict";
import {
  buildSalesSummaryRows,
  buildSalesOrderRows,
  buildSalesExpenseRows,
  buildSalesItemRows,
  buildProductReportRows,
  buildReportFilename,
  buildSalesWorkbookSheets,
  buildProductWorkbookSheets,
  buildSalesPdfModel,
  buildProductPdfModel,
} from "../.dist/modulos/ops/report-dataset-core/src.js";

test("report-dataset-core arma resumen y órdenes", () => {
  const data = {
    orders: [
      {
        order_number: "001",
        created_at: "2026-04-16T12:00:00Z",
        order_type: "delivery",
        customer_name: "Ana",
        payment_method: "card",
        total: 10000,
      },
    ],
    orderItems: [],
    expenses: [{ expense_date: "2026-04-16", description: "Gas", amount: 5000, expense_categories: { name: "Ops" } }],
    startDate: "2026-04-01",
    endDate: "2026-04-16",
    salesTotal: 10000,
    expensesTotal: 5000,
    profit: 5000,
    profitMargin: 50,
  };

  assert.equal(buildSalesSummaryRows(data)[0][0], "REPORTE DE VENTAS");
  assert.equal(buildSalesOrderRows(data)[0]["Número de Orden"], "001");
  assert.equal(buildSalesExpenseRows(data)[0]["Descripción"], "Gas");
});

test("report-dataset-core arma filas de productos", () => {
  const rows = buildProductReportRows({
    startDate: "2026-04-01",
    endDate: "2026-04-16",
    products: [{ product_name: "Pizza", quantity: 5, revenue: 50000, cost: 20000, profit: 30000 }],
  });

  assert.equal(rows[0]["Producto"], "Pizza");
  assert.equal(rows[0]["Utilidad"], 30000);
});

test("report-dataset-core arma ítems, archivos y workbook sheets", () => {
  const data = {
    orders: [],
    orderItems: [{ product_name: "Pizza", quantity: 2, unit_price: 10000, subtotal: 20000 }],
    expenses: [],
    startDate: "2026-04-01",
    endDate: "2026-04-16",
    salesTotal: 20000,
    expensesTotal: 0,
    profit: 20000,
    profitMargin: 100,
  };

  assert.equal(buildSalesItemRows(data)[0]["Producto"], "Pizza");
  assert.equal(buildReportFilename("Reporte Ventas", data.startDate, data.endDate, "pdf"), "reporte_ventas_2026-04-01_2026-04-16.pdf");

  const workbook = buildSalesWorkbookSheets(data);
  assert.equal(workbook[0].name, "Resumen");
  assert.equal(workbook[1].name, "Productos");

  const productWorkbook = buildProductWorkbookSheets({
    startDate: data.startDate,
    endDate: data.endDate,
    products: [{ product_name: "Pizza", quantity: 2, revenue: 20000 }],
  });
  assert.equal(productWorkbook[0].name, "Productos");
});

test("report-dataset-core arma modelos PDF portables", () => {
  const salesPdf = buildSalesPdfModel({
    orders: [
      {
        order_number: "001",
        created_at: "2026-04-16T12:00:00Z",
        order_type: "delivery",
        customer_name: "Ana",
        payment_method: "card",
        total: 10000,
      },
    ],
    orderItems: [],
    expenses: [],
    startDate: "2026-04-01",
    endDate: "2026-04-16",
    salesTotal: 10000,
    expensesTotal: 0,
    profit: 10000,
    profitMargin: 100,
  });

  assert.equal(salesPdf.title, "REPORTE DE VENTAS");
  assert.equal(salesPdf.tables[1].body[0][0], "001");

  const productPdf = buildProductPdfModel({
    startDate: "2026-04-01",
    endDate: "2026-04-16",
    products: [{ product_name: "Pizza", quantity: 5, revenue: 50000, cost: 20000, profit: 30000 }],
  });

  assert.equal(productPdf.title, "REPORTE DE PRODUCTOS");
  assert.equal(productPdf.tables[0].body[0][0], "Pizza");
});
