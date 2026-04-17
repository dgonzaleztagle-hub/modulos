import test from "node:test";
import assert from "node:assert/strict";
import {
  SalesAgentBrain,
  SALES_AGENT_SYSTEM_PROMPT,
  SALES_TOOLS,
} from "../.dist/modulos/crm/sales-agent-core/src.js";

const audit = {
  score: 38,
  ttfb: { value: "1450", abandonmentRate: "22" },
  security: { ssl: "Inválido", serverHeader: "Apache" },
  tech: { builder: "WordPress", isSlow: true, stack: ["wordpress", "php"] },
  competitor: { name: "Competidor X", location: "Santiago", status: "active" },
  mobile: { score: 45, status: "bad" },
};

test("sales-agent-core responde objeción de presupuesto", () => {
  const brain = new SalesAgentBrain(audit);
  const response = brain.generateResponse("¿cuanto cuesta?");
  assert.match(response.content, /Upgrade H0|costo/);
});

test("sales-agent-core perfila técnico y genera respuesta", () => {
  const brain = new SalesAgentBrain(audit);
  const response = brain.generateResponse("mi ssl y el backend están lentos");
  assert.equal(typeof response.content, "string");
});

test("sales-agent-core expone prompt y tools", () => {
  assert.match(SALES_AGENT_SYSTEM_PROMPT, /asesor comercial técnico/i);
  assert.ok(SALES_TOOLS.includes("book_meeting"));
});
