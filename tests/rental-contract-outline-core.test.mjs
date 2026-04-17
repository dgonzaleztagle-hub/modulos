import test from "node:test";
import assert from "node:assert/strict";
import {
  formatContractAmount,
  buildRentalContractOutline,
} from "../.dist/modulos/pdf/rental-contract-outline-core/src.js";

test("rental-contract-outline-core formatea montos", () => {
  assert.equal(formatContractAmount(12.5, "UF"), "12.50 UF");
});

test("rental-contract-outline-core arma outline base", () => {
  const outline = buildRentalContractOutline({
    contract: {
      id: "abcd1234efgh5678",
      created_at: "2026-04-16T00:00:00Z",
      start_date: "2026-05-01",
      end_date: "2027-05-01",
      monthly_rent: 450000,
      currency: "CLP",
    },
    property: {
      name: "Depto Centro",
      address: "Av. Uno",
      comuna: "Santiago",
      city: "Santiago",
      region: "RM",
    },
    client: {
      first_name: "Ana",
      last_name: "Pérez",
    },
    tenantName: "Corredora Uno",
  });

  assert.equal(outline.tenant, "Ana Pérez");
  assert.equal(outline.footer.contractId, "ABCD1234");
  assert.equal(outline.clauses.length, 5);
});
