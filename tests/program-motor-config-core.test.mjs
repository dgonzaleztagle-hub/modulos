import test from "node:test";
import assert from "node:assert/strict";

import {
  getAllProgramMotorConfigs,
  getProgramMotorConfig,
  isProgramType,
  mergeProgramMotorConfig,
} from "../.dist/modulos/commerce/program-motor-config-core/src.js";

test("program-motor-config-core lee config moderna y legacy", () => {
  assert.equal(isProgramType("cashback"), true);
  assert.deepEqual(getProgramMotorConfig({ porcentaje: 10 }, "cashback"), { porcentaje: 10 });
  assert.deepEqual(getProgramMotorConfig({ motors: { cashback: { porcentaje: 12 } } }, "cashback"), { porcentaje: 12 });
});

test("program-motor-config-core lista y mergea motors", () => {
  const configs = getAllProgramMotorConfigs({
    motors: { sellos: { puntos: 10 } },
    porcentaje: 5,
  });
  const merged = mergeProgramMotorConfig({}, configs);

  assert.deepEqual(configs.sellos, { puntos: 10 });
  assert.deepEqual(merged, { motors: { sellos: { puntos: 10 }, cashback: { porcentaje: 5 } } });
});
