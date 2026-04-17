export type RentalContractInput = {
  contract: {
    id: string;
    start_date?: string;
    end_date?: string;
    monthly_rent?: number;
    currency?: string;
    common_expenses?: number;
    guarantee_months?: number;
    notes?: string;
    created_at: string;
  };
  property: {
    name: string;
    address: string;
    address_number?: string;
    address_extra?: string;
    comuna: string;
    city: string;
    region: string;
    bedrooms?: number;
    bathrooms?: number;
    total_area?: number;
  };
  client: {
    first_name: string;
    last_name: string;
    rut?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  tenantName?: string;
};

export function formatContractDate(dateStr?: string) {
  if (!dateStr) return "Por definir";
  return new Date(dateStr).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatContractAmount(amount?: number, currency?: string) {
  if (!amount) return "No especificado";
  if (currency === "UF") return `${amount.toFixed(2)} UF`;
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(amount);
}

export function getDefaultRentalClauses() {
  return [
    {
      title: "Destino del inmueble",
      text: "El inmueble será destinado exclusivamente para uso habitacional del arrendatario y su grupo familiar, quedando prohibido destinarlo a cualquier otro uso sin autorización escrita del arrendador.",
    },
    {
      title: "Pago del canon",
      text: "El arrendatario se obliga a pagar el canon de arrendamiento dentro de los primeros cinco días hábiles de cada mes. El no pago oportuno generará los intereses y recargos establecidos en la normativa aplicable.",
    },
    {
      title: "Estado del inmueble",
      text: "El arrendatario declara recibir el inmueble en buen estado de conservación, comprometiéndose a devolverlo en las mismas condiciones al término del contrato, salvo el deterioro normal por el uso.",
    },
    {
      title: "Normativa aplicable",
      text: "El presente contrato se rige por la normativa chilena de arrendamiento de predios urbanos y por las reglas que las partes acepten en la firma del documento.",
    },
    {
      title: "Firma electrónica",
      text: "Las partes acuerdan que la suscripción del presente contrato mediante firma electrónica tiene plena validez legal conforme a la normativa vigente sobre documentos y firma electrónica.",
    },
  ];
}

export function buildRentalContractOutline(input: RentalContractInput) {
  const { contract, property, client, tenantName } = input;
  const fullAddress = [property.address, property.address_number, property.address_extra].filter(Boolean).join(" ");
  const clientFullName = `${client.first_name} ${client.last_name}`;

  return {
    title: "Contrato de Arrendamiento",
    landlord: tenantName || "Representado por corredor de propiedades",
    tenant: clientFullName,
    property: {
      name: property.name,
      address: fullAddress,
      location: `${property.comuna}, ${property.city}`,
      region: property.region,
      totalArea: property.total_area ? `${property.total_area} m²` : null,
      rooms:
        property.bedrooms != null
          ? `${property.bedrooms} dorm. / ${property.bathrooms ?? "—"} baños`
          : null,
    },
    economics: {
      monthlyRent: formatContractAmount(contract.monthly_rent, contract.currency),
      commonExpenses:
        contract.common_expenses != null ? formatContractAmount(contract.common_expenses, "CLP") : null,
      guaranteeMonths:
        contract.guarantee_months != null
          ? `${contract.guarantee_months} mes${contract.guarantee_months !== 1 ? "es" : ""} de arriendo`
          : null,
    },
    term: {
      start: formatContractDate(contract.start_date),
      end: formatContractDate(contract.end_date),
    },
    clauses: getDefaultRentalClauses(),
    footer: {
      generatedAt: formatContractDate(contract.created_at),
      contractId: contract.id.slice(0, 8).toUpperCase(),
    },
  };
}
