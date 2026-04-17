# report-pipeline-core

Helpers portables para la tubería cloud/local de reportes PDF y su vínculo con registros fuente.

## Qué resuelve

- define nombres consistentes para assets PDF
- arma patch portable para persistir URL pública y timestamp
- construye URL de impresión
- define headers de descarga
- normaliza toggles/customizaciones del builder

## Origen

- `hojacero/components/report/ReportBuilderModal.tsx`
- `hojacero/app/api/reporte/[reportId]/pdf/route.ts`

## Estado

`usable inicial endurecido`


## Estado real

Ya aporta un pipeline reusable para assets, descargas y customización de reportes.
