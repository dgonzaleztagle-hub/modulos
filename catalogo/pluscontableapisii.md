# pluscontableapisii

Repo origen: `D:\proyectos\pluscontableapisii`

## Módulo: sincronización de libros SII bajo demanda

- taxonomía: `integraciones externas`
- rutas clave: `backend/app.py`, `backend/services/sii_scraper.py`, `backend/services/sii_parser.py`, `KNOWLEDGE_BASE.md`
- problema que resuelve: autenticar contra SII Chile y descargar libros de compras/ventas para luego integrarlos a una app contable
- alcance real observado: health check, test de conexión, sync individual y sync paralelo de COMPRAS/VENTAS por mes/año
- dependencias externas: Flask, Playwright, SII Chile, CORS
- entidades y flujos principales: credenciales SII -> login -> fetch libros -> parseo -> JSON -> app cliente
- señales de modularidad: backend separado, endpoints claros y documentación bastante explícita del flujo
- señales de acoplamiento o deuda: alta dependencia de scraping contra un tercero volátil, credenciales sensibles y lógica muy chilena/SII
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Veredicto

- sí entra al mapa principal como satélite valioso
- no compite con `pluscontable.cl`; más bien lo complementa como backend externo de integración tributaria
