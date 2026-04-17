import test from "node:test";
import assert from "node:assert/strict";

import {
  createEmptyProjectWorkspace,
  normalizeProjectWorkspaceData,
  resolveProjectLastActivity,
} from "../.dist/modulos/ops/project-workspace-core/src.js";

test("project-workspace-core crea workspace vacío", () => {
  assert.deepEqual(createEmptyProjectWorkspace(), {
    clients: [],
    payments: [],
    notes: "",
    tasks: [],
    credentials: { custom: [] },
  });
});

test("project-workspace-core normaliza blobs incompletos", () => {
  assert.deepEqual(normalizeProjectWorkspaceData({ notes: "hola", credentials: null }), {
    clients: [],
    payments: [],
    notes: "hola",
    tasks: [],
    credentials: { custom: [] },
  });
});

test("project-workspace-core resuelve actividad reciente", () => {
  assert.equal(
    resolveProjectLastActivity({ createdAt: "2026-01-01T00:00:00.000Z", lastModified: "2026-01-02T00:00:00.000Z" }),
    "2026-01-02T00:00:00.000Z",
  );
});

