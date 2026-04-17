# Caso: TruckPOS New

## Tipo

POS food / operación restaurante

## Valor principal encontrado

- control de caja
- importación de productos
- multi-sucursal
- impresión / kitchen tickets
- reportes operativos

## Qué piezas aporta al sistema MODULOS

- `pos/product-importer`
- `pos/table-service-core`
- `pos/ticket-format-core`
- `ops/food-ops-notification-core`
- `ops/report-dataset-core`
- `payments/mercadopago-core`
- `pdf/tenant-branded-documents`
- parte del futuro `food/food-engine-core`
- referencias de caja, inventario y terminal

## Cuándo abrir este caso

- cuando el cliente necesita más operación interna que branding
- cuando el foco es POS, caja, productos o inventario

## Qué no hacer

- no tomar `truckpos_new` como solución completa de delivery o reservas
- no usar su UI completa como blueprint de marca pública
