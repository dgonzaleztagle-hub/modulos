# Contrato propuesto

## Concepto

El módulo recibe un documento de layout libre compuesto por items visuales y devuelve operaciones de edición, serialización y renderizado desacopladas del producto final.

## Interface mínima

```ts
type BuilderItemType =
  | "text"
  | "button"
  | "image"
  | "video"
  | "plans_widget"
  | "service_widget";

interface BuilderItem {
  id: string;
  type: BuilderItemType;
  position: { x: number; y: number };
  size: { width: number | "auto"; height: number | "auto" };
  content: Record<string, unknown>;
  style: Record<string, unknown>;
}

interface BuilderDocument {
  version: string;
  items: BuilderItem[];
  canvas?: {
    background?: string;
    gridEnabled?: boolean;
  };
}

interface BuilderWidgetAdapter<TData = unknown> {
  type: BuilderItemType;
  resolve: (item: BuilderItem, dataset: TData[]) => unknown;
}
```

## Salida esperada

- documento serializable y portable
- operaciones puras para add/update/remove/move/layering
- helpers de historial undo/redo
- import/export JSON con saneo básico para usarlo como puente con IA
- renderer que funcione con adapters de widgets, no con `PlanCard` o `ServiceCard` fijos

## Regla ejecutiva

El motor libre debe vivir separado del layout seccional por bloques. Si ambos comparten persistencia, esa convergencia debe pasar por un adapter, no por mezclar contratos.
