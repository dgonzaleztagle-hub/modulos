export type WalletProgramType =
  | "sellos"
  | "cashback"
  | "multipase"
  | "membresia"
  | "descuento"
  | "cupon"
  | "regalo"
  | "afiliacion";

export interface WalletObjectInput {
  issuerId: string;
  classId: string;
  objectId: string;
  merchantName: string;
  userName: string;
  points: number;
  programType?: WalletProgramType | string;
  programLabel?: string;
  customerWhatsapp?: string;
  tenantSlug?: string;
  appUrl?: string;
  lat?: number;
  lng?: number;
  geoMessage?: string;
}

export interface WalletClassInput {
  issuerId: string;
  classId: string;
  programName: string;
  issuerName?: string;
  logoUrl?: string;
  hexBackgroundColor?: string;
  lat?: number;
  lng?: number;
  geoMessage?: string;
}

export function validateGoogleWalletPrivateKeyFormat(privateKey: string) {
  return privateKey.includes("-----BEGIN PRIVATE KEY-----") && privateKey.includes("-----END PRIVATE KEY-----");
}

export function getWalletProgramLabel(type: WalletProgramType | string): string {
  const labels: Record<string, string> = {
    sellos: "Puntos Vuelve+",
    cashback: "Cashback $",
    multipase: "Usos restantes",
    membresia: "Visitas VIP",
    descuento: "Visitas",
    cupon: "Cupones",
    regalo: "Saldo $",
    afiliacion: "Visitas",
  };
  return labels[type] || "Puntos Vuelve+";
}

export function buildWalletObjectCandidates(input: {
  issuerId: string;
  tenantSlug: string;
  customerId?: string;
  whatsapp?: string;
}) {
  const candidates = [
    input.customerId ? `${input.issuerId}.vuelve-${input.tenantSlug}-${input.customerId}` : null,
    input.whatsapp ? `${input.issuerId}.vuelve-${input.tenantSlug}-${input.whatsapp}` : null,
  ].filter(Boolean) as string[];

  return Array.from(new Set(candidates));
}

export function buildGoogleWalletObject(input: WalletObjectInput) {
  const baseUrl = input.appUrl || "https://vuelveplus.cl";
  const params = new URLSearchParams();
  if (input.customerWhatsapp) params.set("whatsapp", input.customerWhatsapp);
  if (input.tenantSlug) params.set("tenant_slug", input.tenantSlug);
  const walletUrl = `${baseUrl}/mi-tarjeta${params.toString() ? `?${params.toString()}` : ""}`;

  const objectPayload: Record<string, unknown> = {
    id: `${input.issuerId}.${input.objectId}`,
    classId: `${input.issuerId}.${input.classId}`,
    state: "ACTIVE",
    accountHolderName: input.userName,
    accountId: input.objectId,
    barcode: {
      type: "QR_CODE",
      value: `${input.issuerId}.${input.objectId}`,
    },
    loyaltyPoints: {
      label: input.programLabel || getWalletProgramLabel(input.programType || "sellos"),
      balance: { int: input.points },
    },
    linksModuleData: {
      uris: [
        {
          uri: walletUrl,
          description: "💎 Ver mis beneficios y medallas",
          id: "pwa-link",
        },
      ],
    },
  };

  if (input.lat && input.lng) {
    objectPayload.locations = [{ latitude: input.lat, longitude: input.lng }];
  }

  if (input.geoMessage) {
    objectPayload.messages = [
      {
        header: input.merchantName,
        body: input.geoMessage,
        id: "geo-welcome",
        messageType: "TEXT",
      },
    ];
  }

  return objectPayload;
}

export function buildGoogleWalletClass(input: WalletClassInput) {
  const classPayload: Record<string, unknown> = {
    id: `${input.issuerId}.${input.classId}`,
    programName: input.programName,
    issuerName: input.issuerName || "Vuelve+",
    reviewStatus: "UNDER_REVIEW",
    allowMultipleUsersPerObject: true,
  };

  if (input.logoUrl) {
    classPayload.programLogo = {
      sourceUri: { uri: input.logoUrl },
      contentDescription: {
        defaultValue: { language: "es", value: input.programName },
      },
    };
  }

  if (input.hexBackgroundColor) {
    classPayload.hexBackgroundColor = input.hexBackgroundColor;
  }

  if (input.lat && input.lng) {
    classPayload.locations = [{ latitude: input.lat, longitude: input.lng }];
  }

  if (input.geoMessage) {
    classPayload.messages = [
      {
        header: input.programName,
        body: input.geoMessage,
        id: "geo-class",
        messageType: "TEXT",
      },
    ];
  }

  return classPayload;
}
