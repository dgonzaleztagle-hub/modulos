import test from "node:test";
import assert from "node:assert/strict";

import {
  SAFETY_SYSTEM_PROMPTS,
  buildSafetyChatMessages,
  buildSafetyGatewayPayload,
  buildSafetyUserMessage,
  normalizeSafetyAssistantResponse,
} from "../.dist/modulos/ai/safety-assistant-core/src.js";

test("safety-assistant-core builds suggest measures message", () => {
  const message = buildSafetyUserMessage({
    type: "suggest_measures",
    context: {
      accident_type: "caida",
      description: "Caida desde escalera",
      root_cause: "Escalera sin inspeccion",
    },
  });

  assert.ok(message.includes("caida"));
  assert.ok(message.includes("Escalera sin inspeccion"));
});

test("safety-assistant-core builds chat messages and payload", () => {
  const request = {
    type: "chat_cphs",
    context: { message: "Que dice la ley 16.744?" },
  };

  const messages = buildSafetyChatMessages(request);
  const payload = buildSafetyGatewayPayload(
    {
      baseUrl: "https://example.com",
      apiKey: "key",
      model: "demo-model",
    },
    request,
  );

  assert.equal(messages[0].role, "system");
  assert.ok(SAFETY_SYSTEM_PROMPTS.chat_cphs.includes("16.744"));
  assert.equal(payload.model, "demo-model");
  assert.equal(payload.messages[1].content, "Que dice la ley 16.744?");
});

test("safety-assistant-core normalizes gateway responses", () => {
  assert.equal(normalizeSafetyAssistantResponse(" Hola "), "Hola");
  assert.equal(normalizeSafetyAssistantResponse({ content: " Mundo " }), "Mundo");
  assert.equal(
    normalizeSafetyAssistantResponse({
      choices: [{ message: { content: " Respuesta " } }],
    }),
    "Respuesta",
  );
});
