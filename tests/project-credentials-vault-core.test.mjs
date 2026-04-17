import test from "node:test";
import assert from "node:assert/strict";

import {
  addCustomCredential,
  createEmptyProjectCredentialsVault,
  removeCustomCredential,
  updateCustomCredential,
  upsertProjectCredentialsVault,
} from "../.dist/modulos/access/project-credentials-vault-core/src.js";

test("project-credentials-vault-core crea y mezcla vault", () => {
  const vault = upsertProjectCredentialsVault(createEmptyProjectCredentialsVault(), {
    github: { repoUrl: "https://github.com/cloudlab/modulos" },
  });

  assert.equal(vault.github?.repoUrl, "https://github.com/cloudlab/modulos");
  assert.deepEqual(vault.custom, []);
});

test("project-credentials-vault-core agrega actualiza y remueve custom", () => {
  const added = addCustomCredential(createEmptyProjectCredentialsVault(), {
    id: "cred-1",
    name: "AWS",
    value: "secret",
    isSecret: true,
  });
  const updated = updateCustomCredential(added, "cred-1", { name: "AWS Root" });
  const removed = removeCustomCredential(updated, "cred-1");

  assert.equal(updated.custom[0].name, "AWS Root");
  assert.equal(removed.custom.length, 0);
});
