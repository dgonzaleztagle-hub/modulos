# Contrato propuesto

## Interface mínima

```ts
interface DocumentBranding {
  appName: string;
  logoUrl?: string | null;
  supportEmail?: string | null;
  primaryColor?: string | null;
}

interface DocumentSection {
  title?: string;
  rows?: Array<{ label: string; value: string }>;
  body?: string;
}

interface DocumentPayload {
  title: string;
  subtitle?: string;
  branding: DocumentBranding;
  sections: DocumentSection[];
  footerNote?: string;
}
```

## Decisión ejecutiva

- primero se define contrato común
- luego se implementan adaptadores por motor: `jspdf`, `react-pdf`, `pdf-lib`
- las plantillas de vertical viven fuera del core
