import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSnapshotManifest,
  chunkValues,
  dedupeRowsById,
  renderSnapshotSummary,
} from "../.dist/modulos/ops/snapshot-toolkit/src.js";

test("snapshot-toolkit chunks values and deduplicates by id", () => {
  assert.deepEqual(chunkValues([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
  assert.equal(dedupeRowsById([{ id: 1, v: "a" }, { id: 1, v: "b" }]).length, 1);
});

test("snapshot-toolkit builds manifest and summary", () => {
  const manifest = buildSnapshotManifest({
    startedAt: "2026-04-15T00:00:00Z",
    finishedAt: "2026-04-15T01:00:00Z",
    targets: [{ id: "r1", name: "Gover" }],
    tableData: { clients: [{ id: 1 }], plans: [] },
  });

  assert.equal(manifest.counts.clients, 1);
  const summary = renderSnapshotSummary({
    startedAt: manifest.startedAt,
    finishedAt: manifest.finishedAt,
    targets: manifest.targetResellers,
    counts: manifest.counts,
  });
  assert.match(summary, /clients: 1/);
});
