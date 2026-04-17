export type SalesReportData = {
  orders: any[];
  orderItems: any[];
  expenses: any[];
  startDate: string;
  endDate: string;
  salesTotal: number;
  expensesTotal: number;
  profit: number;
  profitMargin: number;
};

export type ProductReportData = {
  products: Array<{
    product_name: string;
    quantity: number;
    revenue: number;
    cost?: number;
    profit?: number;
  }>;
  startDate: string;
  endDate: string;
};

export type ReportFileExtension = "xlsx" | "csv" | "pdf";

export type ReportSheet = {
  name: string;
  rows: Array<Record<string, unknown>> | unknown[][];
};

export type ReportPdfTable = {
  title: string;
  head: string[];
  body: string[][];
};

export type ReportPdfModel = {
  title: string;
  periodLabel: string;
  tables: ReportPdfTable[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es-CL");
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function buildSalesSummaryRows(data: SalesReportData) {
  return [
    ["REPORTE DE VENTAS"],
    [`Período: ${data.startDate} a ${data.endDate}`],
    [],
    ["Concepto", "Valor"],
    ["Ventas Totales", data.salesTotal],
    ["Gastos Totales", data.expensesTotal],
    ["Utilidad Neta", data.profit],
    ["Margen de Utilidad", `${data.profitMargin.toFixed(2)}%`],
    ["Cantidad de Órdenes", data.orders.length],
  ];
}

export function buildSalesOrderRows(data: SalesReportData) {
  return data.orders.map((order) => ({
    "Número de Orden": order.order_number,
    Fecha: formatDate(order.created_at),
    Hora: formatTime(order.created_at),
    Tipo: order.order_type,
    Cliente: order.customer_name || "-",
    "Método de Pago": order.payment_method || "-",
    Total: order.total,
  }));
}

export function buildSalesExpenseRows(data: SalesReportData) {
  return data.expenses.map((expense) => ({
    Fecha: formatDate(expense.expense_date),
    Descripción: expense.description,
    Categoría: expense.expense_categories?.name || "-",
    Monto: expense.amount,
    Notas: expense.notes || "-",
  }));
}

export function buildSalesItemRows(data: SalesReportData) {
  return data.orderItems.map((item) => ({
    Producto: item.product_name,
    Cantidad: item.quantity,
    "Precio Unitario": item.unit_price,
    Subtotal: item.subtotal,
  }));
}

export function buildProductReportRows(data: ProductReportData) {
  return data.products.map((product) => ({
    Producto: product.product_name,
    "Unidades Vendidas": product.quantity,
    Ingresos: product.revenue,
    "Costo Total": product.cost || 0,
    Utilidad: product.profit || 0,
  }));
}

export function buildSalesCsvRows(data: SalesReportData) {
  return [
    ["REPORTE DE VENTAS"],
    [`Período: ${data.startDate} a ${data.endDate}`],
    [],
    ["RESUMEN"],
    ["Ventas Totales", data.salesTotal],
    ["Gastos Totales", data.expensesTotal],
    ["Utilidad Neta", data.profit],
    ["Margen de Utilidad", `${data.profitMargin.toFixed(2)}%`],
    [],
    ["VENTAS DETALLADAS"],
    ["Número de Orden", "Fecha", "Hora", "Tipo", "Cliente", "Método de Pago", "Total"],
    ...data.orders.map((order) => [
      order.order_number,
      formatDate(order.created_at),
      formatTime(order.created_at),
      order.order_type,
      order.customer_name || "-",
      order.payment_method || "-",
      order.total,
    ]),
  ];
}

export function buildReportFilename(
  prefix: string,
  startDate: string,
  endDate: string,
  extension: ReportFileExtension,
) {
  const safePrefix = String(prefix || "reporte")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${safePrefix || "reporte"}_${startDate}_${endDate}.${extension}`;
}

export function buildSalesWorkbookSheets(data: SalesReportData): ReportSheet[] {
  const sheets: ReportSheet[] = [
    { name: "Resumen", rows: buildSalesSummaryRows(data) },
  ];

  const orderRows = buildSalesOrderRows(data);
  if (orderRows.length > 0) {
    sheets.push({ name: "Ventas", rows: orderRows });
  }

  const itemRows = buildSalesItemRows(data);
  if (itemRows.length > 0) {
    sheets.push({ name: "Productos", rows: itemRows });
  }

  const expenseRows = buildSalesExpenseRows(data);
  if (expenseRows.length > 0) {
    sheets.push({ name: "Gastos", rows: expenseRows });
  }

  return sheets;
}

export function buildProductWorkbookSheets(data: ProductReportData): ReportSheet[] {
  return [{ name: "Productos", rows: buildProductReportRows(data) }];
}

export function buildSalesPdfModel(data: SalesReportData): ReportPdfModel {
  return {
    title: "REPORTE DE VENTAS",
    periodLabel: `Período: ${data.startDate} a ${data.endDate}`,
    tables: [
      {
        title: "Resumen Financiero",
        head: ["Concepto", "Valor"],
        body: [
          ["Ventas Totales", String(data.salesTotal)],
          ["Gastos Totales", String(data.expensesTotal)],
          ["Utilidad Neta", String(data.profit)],
          ["Margen de Utilidad", `${data.profitMargin.toFixed(2)}%`],
          ["Cantidad de Órdenes", String(data.orders.length)],
        ],
      },
      {
        title: "Detalle de Ventas",
        head: ["Orden", "Fecha", "Tipo", "Cliente", "Pago", "Total"],
        body: data.orders.map((order) => [
          String(order.order_number ?? "-"),
          formatDate(order.created_at),
          String(order.order_type ?? "-"),
          String(order.customer_name || "-"),
          String(order.payment_method || "-"),
          String(order.total ?? 0),
        ]),
      },
    ],
  };
}

export function buildProductPdfModel(data: ProductReportData): ReportPdfModel {
  return {
    title: "REPORTE DE PRODUCTOS",
    periodLabel: `Período: ${data.startDate} a ${data.endDate}`,
    tables: [
      {
        title: "Productos",
        head: ["Producto", "Vendidos", "Ingresos", "Costo", "Utilidad"],
        body: data.products.map((product) => [
          String(product.product_name),
          String(product.quantity),
          String(product.revenue),
          String(product.cost ?? 0),
          String(product.profit ?? 0),
        ]),
      },
    ],
  };
}
