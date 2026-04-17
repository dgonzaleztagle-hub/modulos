import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCreateFlowCustomer,
  buildCreateFlowPlan,
  buildCreateFlowSubscription,
  buildFlowRequest,
  buildRegisterFlowCard,
  signFlowParams,
} from "../.dist/modulos/payments/flow-subscription-core/src.js";

test("flow-subscription-core firma y arma request", () => {
  const signature = signFlowParams({ amount: 1000, apiKey: "key" }, "secret");
  const request = buildFlowRequest("plans/create", { amount: 1000 }, { apiKey: "key", secretKey: "secret" });

  assert.equal(signature.length, 64);
  assert.match(request.body, /apiKey=key/);
  assert.match(request.body, /s=/);
});

test("flow-subscription-core arma payloads comerciales", () => {
  assert.deepEqual(buildCreateFlowPlan({ planId: "pro", name: "Plan Pro", amount: 10000 }).currency, "CLP");
  assert.deepEqual(buildCreateFlowSubscription({
    customerId: "c1",
    customerEmail: "a@b.cl",
    planId: "p1",
    urlCallback: "https://demo.cl",
  }).planId, "p1");
  assert.deepEqual(buildCreateFlowCustomer({ name: "Ana", email: "a@b.cl", externalId: "ext" }).externalId, "ext");
  assert.deepEqual(buildRegisterFlowCard({ customerId: "c1", urlReturn: "https://demo.cl" }).url_return, "https://demo.cl");
});
