# Caso: agendaproyectos

## Tipo

`crm-operativo`

## Qué resolvió

- workspace interno por proyecto con clientes, pagos, notas, tareas y credenciales
- consolidación de varias áreas operativas dentro de una sola ficha JSON por proyecto
- normalización de data embebida para no romper tabs
- contabilidad liviana de implementación y mantenimiento
- vault operativo básico para GitHub, Supabase, Vercel y credenciales custom
- dashboard consolidado para leer ingresos del portafolio completo

## Piezas que ya viven en `MODULOS`

- `ops/project-workspace-core`
- `ops/project-accounting-core`
- `access/project-credentials-vault-core`

## Repos de origen

- `agendaproyectos`

## Observaciones

- este caso vale más como herramienta operativa interna que como producto final
- aporta una familia útil para workspaces de proyecto y control liviano de cuentas
- muestra una evolución interesante desde tablas separadas hacia `workspace document` unificado, que es probablemente la decisión reusable más valiosa del repo
